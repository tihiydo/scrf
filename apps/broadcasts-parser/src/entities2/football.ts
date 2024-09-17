export interface SomeEvent {
    error: number
    message: string
    data: Daum[]
    meta: Meta
  }
  
  export interface Daum {
    id: number
    league: League
    localteam?: Localteam
    visitorteam?: Visitorteam
    status: string
    has_live: boolean
    playing: boolean
    start_at: number
    minute?: number
    extra_minute: any
    winner_team_id?: number
    scores?: Scores
    events?: Event[]
    name?: string
    sport_id: number
  }
  
  export interface League {
    id: number
    name: string
    priority: number
    country?: string
    code?: string
  }
  
  export interface Localteam {
    id: number
    name: string
    country: any
    code?: string
    logo: string
  }
  
  export interface Visitorteam {
    id: number
    name: string
    country: any
    code?: string
    logo: string
  }
  
  export interface Scores {
    et_score: any
    ft_score?: string
    ht_score?: string
    ps_score: any
    localteam_score: number
    visitorteam_score: number
    localteam_pen_score: any
    visitorteam_pen_score: any
  }
  
  export interface Event {
    id: string
    t: string
    min: number
    tid: number
    pid?: number
    pname: string
    exmin?: number
    rpid?: number
    rpname?: string
    result?: string
  }
  
  export interface Meta {
    next: string
    prev: string
  }
  