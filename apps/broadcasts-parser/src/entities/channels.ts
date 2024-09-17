export interface ChannelsLive {
    error: number
    message: string
    data: Daum[]
    meta: Meta
  }
  
  export interface Daum {
    id: number
    name: string
    logo: string
    channels: Channel[]
  }
  
  export interface Channel {
    id: number
    name: string
    url: string
  }
  
  export interface Meta {
    next: string
    prev: string
  }
  

  export interface CustomChannels
  {
    id: number;
    channelName: string;
    channelLink: string;
  }