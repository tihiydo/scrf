'use client'

import classNames from 'classnames'
import styles from './styles.module.scss'
import { GetAllDevices } from "@/api/requests/devices/get-all"

type Props = {}

const DeviceSection = (props: Props) => {
    const devicesQuery = GetAllDevices.useQuery();
    const devices = devicesQuery.data?.devices ?? [];

    return (
        <section>
            <h4>Devices</h4>

            <div className={styles.list}>
                {devices.map(device => (
                    <div className={styles.card} key={device.userAgent}>

                        <h6 className={styles.cardTitle}>
                            {device.userAgent}
                        </h6>

                        <div>
                            {device.isOnline ? 'Online' : new Date(device.lastSeen).toLocaleString()}
                        </div>

                        <div>
                            {device.location}
                        </div>

                        <div>
                            {device.ipAddress}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default DeviceSection