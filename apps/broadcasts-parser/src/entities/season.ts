// Определяем типы для данных о лиге, команде, статусе и счете
interface League {
    id: number;
    name: string;
    priority: number;
    country: string;
}

interface Team {
    id: number;
    name: string;
    country: string | null;
    logo: string;
}

interface Scores {
    et_score: number | null;
    ft_score: number | null;
    ht_score: number | null;
    ps_score: number | null;
    localteam_score: number;
    visitorteam_score: number;
    localteam_pen_score: number | null;
    visitorteam_pen_score: number | null;
}

interface Match {
    id: number;
    league: League;
    localteam: Team;
    visitorteam: Team;
    status: string;
    has_live: boolean;
    playing: boolean;
    start_at: number;  // Unix timestamp
    minute: number | null;
    extra_minute: number | null;
    winner_team_id: number | null;
    scores: Scores;
}

// Определяем тип для ответа с матчами
interface seasonResponse {
    error: number;
    message: string;
    data: Match[];
    meta: {
        next: string;
        prev: string;
    };
}
