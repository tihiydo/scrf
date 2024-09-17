export interface LiveEvents {
  uid: string;
  matchId: number;
  firstName: string | null;
  firstLogo: string | null;
  secondName: string | null;
  secondLogo: string | null;
  startAt: number;
  liveStream: string | null;
  sportId: number;
  leagueId: number | null;
  leagueName: string | null;
  eventName: string | null
}

export interface Url {
  title: string
  url: string
}

export type Broadcast = {
  id: number;
  channelName: string;
  channelLink: string;
};