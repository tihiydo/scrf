import {
  WebSocketGateway,
  OnGatewayDisconnect,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayInit,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Namespace, RemoteSocket, Server, Socket } from 'socket.io';
import { JwtService } from 'src/auth/services/jwt.service';
import * as cookie from 'cookie';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRole, Subscriptions, User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { DevicesService } from './devices.service';
import * as geoip from 'geoip-lite';
import { Device } from './entities/device.entity';
import {
  DecorateAcknowledgementsWithMultipleResponses,
  DefaultEventsMap,
} from 'socket.io/dist/typed-events';
import { SOCKET_DENY_ERROR } from './constants';

type AccessType = 'granted' | 'denied' | 'idle';

type CustomSocket = Socket & {
  user?: User;
  device?: Device;
  access?: AccessType;
  media?: {
    id: string;
  };
};

const subscriptionDevices: Record<Subscriptions, number> = {
  '1': 2,
  '2': 5,
  '3': 8,
};

@WebSocketGateway({
  namespace: `/api/devices`,
  path: '/api/socket.io',
  cors: {
    origin: [
      'http://localhost:3000',
      'https://screenify.one',
      'https://dev.screenify.one',
    ],
    credentials: true,
  },
})
export class DeviceGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  nsp: Namespace;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly jwtService: JwtService,

    private readonly devicesService: DevicesService,
  ) { }

  afterInit(nsp: Namespace) {
    nsp.use(async (socket: CustomSocket, next) => {
      try {
        const userAgent = socket.handshake.headers['user-agent'];
        const ip = this._getSocketIp(socket) ?? '127.0.0.1';
        const location = geoip.lookup(ip)?.city;

        const mediaId = socket.handshake.query.mediaId as string;

        socket.media = {
          id: mediaId,
        };

        const refreshToken = cookie.parse(
          socket.handshake.headers.cookie ?? '',
        )?.['jwt-refresh-token'];

        const jwtPayload = this.jwtService.parseRefreshJwtPayload(refreshToken);

        const dbUser = await this.usersRepository.findOne({
          where: {
            id: jwtPayload.id,
          },
        });

        if (!socket.access) {
          socket.access = 'idle';
        }

        socket.user = dbUser;

        let device = await this.devicesService.getUserDevice({
          userId: dbUser.id,
          userAgent: userAgent,
        });

        if (!device) {
          const newDevice = await this.devicesService.createDevice({
            ip: ip,
            userAgent,
            userId: dbUser.id,
            location,
          });

          device = newDevice;
        }

        socket.device = device;

        next();
      } catch (error) {
        next();
      }
    });
  }

  @SubscribeMessage('ungrant')
  handleUngrant(socket: CustomSocket, payload: any): void {

    socket.access = 'denied';


  }

  async handleConnection(client: CustomSocket) {

    try {
      const userAgent = client.handshake.headers['user-agent'];
      const ip = this._getSocketIp(client);
      const location = geoip.lookup(ip)?.city;


      const user = client.user;

      if (!client.user || !client.device) {
        return this._denySocket(client, {
          connectedDevices: [],
          code: SOCKET_DENY_ERROR.UNAUTHENTIFICATED,
        });
      }

      if (Object.values(AdminRole).some((r) => user.role === r)) {
        return this._grantSocket(client);
      }

      // Register device connection
      client.join(user.id);
      await this.devicesService.registerDeviceConnection({
        ipAddress: ip,
        userAgent: userAgent,
        userId: user.id,
        location: location,
      });

      const roomSockets = await this.nsp.in(user.id).fetchSockets();
      const grantedRoomSockets = roomSockets.filter((s) => {
        // @ts-ignore
        return s.access === 'granted' && !s.disconnected;
      });

      const connectedDevices =
        this._getConnectedRoomSocketsDevices(roomSockets);

      const maxDevices = subscriptionDevices[user.currentSubscription];

      // const subscriptionValid =
      //   !!user.currentSubscription &&
      //   typeof maxDevices === 'number' &&
      //   (user.subscriptionExpired?.getTime() ?? 0) >= Date.now();

      // if (!subscriptionValid)
      //   return this._denySocket(client, {
      //     connectedDevices,
      //     code: SOCKET_DENY_ERROR.INVALID_SUBSCRIPTION,
      //   });

      if (grantedRoomSockets.length >= maxDevices) {
        return this._denySocket(client, {
          connectedDevices,
          code: SOCKET_DENY_ERROR.DEVICE_LIMIT,
        });
      }

      if (!client.media?.id) {
        return this._denySocket(client, {
          connectedDevices,
          code: SOCKET_DENY_ERROR.NO_MEDIA_ID,
        });
      }

      this._grantSocket(client);
    } catch (error) {
      this._denySocket(client, {
        connectedDevices: [],
        code: SOCKET_DENY_ERROR.OTHER,
      });

    }
  }

  async handleDisconnect(socket: CustomSocket) {
    if (socket.user?.id) {
      await this.devicesService.setIsOnline(false, {
        userAgent: socket.handshake.headers['user-agent'],
        userId: socket.user.id,
      });
      // Ensure immediate cleanup of the socket
      socket.leave(socket.user.id);
    }

    this._handleAsyncDisconnect(socket);
  }

  private _getSocketIp(socket: Socket) {
    return (socket.handshake.headers['x-forwarded-for'] as string)?.split(
      ' ,',
    )[0];
  }

  private _denySocket(
    socket: CustomSocket,
    info: { connectedDevices: Device[]; code: string },
  ) {
    socket.access = 'denied';
    return socket.emit('access/denied', info);
  }

  private _grantSocket(
    socket:
      | CustomSocket
      | RemoteSocket<
        DecorateAcknowledgementsWithMultipleResponses<DefaultEventsMap>,
        any
      >,
  ) {
    // @ts-ignore

    // @ts-ignore
    socket.access = 'granted';

    // @ts-ignore
    return socket.emit('access/granted', socket.media?.id);
  }

  async _handleAsyncDisconnect(socket: CustomSocket) {
    try {
      const user = socket.user;
      const device = socket.device;

      if (user && device) {
        const maxDevices = subscriptionDevices[user.currentSubscription];

        // const subscriptionValid =
        //   !!user.currentSubscription &&
        //   typeof maxDevices === 'number' &&
        //   (user.subscriptionExpired?.getTime() ?? 0) >= Date.now();

        // if (!subscriptionValid) return;

        const roomSockets = await this.nsp.in(user.id).fetchSockets();
        const grantedRoomSockets = roomSockets.filter(
          // @ts-ignore
          (s) => s.access === 'granted' && !s.disconnected,
        );

        // Grant access to previously ungranted socket
        if (grantedRoomSockets.length < maxDevices) {


          const newGrantSocket = roomSockets.find(
            // @ts-ignore
            (rmSocket) => rmSocket.access === 'denied',
          );

          // @ts-ignore
          if (!newGrantSocket?.media?.id) return;

          // @ts-ignore

          if (!newGrantSocket) return;


          this._grantSocket(newGrantSocket);
        }
      }
    } catch (error) {

    }
  }

  private _getConnectedRoomSocketsDevices(
    sockets: RemoteSocket<
      DecorateAcknowledgementsWithMultipleResponses<DefaultEventsMap>,
      any
    >[],
  ) {
    const connectedDevices: Device[] = [];
    sockets.forEach((s) => {
      // @ts-ignore
      if (s.disconnected) return;

      connectedDevices.push((s as any).device);
    });

    return connectedDevices;
  }
}
