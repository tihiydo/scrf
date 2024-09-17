export interface FixturesLive {
    error: number
    message: string
    data: Daum[]
  }
  
  export interface Daum {
    id: number
    urls: Url[]
  }
  
  export interface Url {
    title: string
    url: string
  }
  