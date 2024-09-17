// Интерфейс для объекта группы
interface Group {
    id: number;
    name: string;
    from: number | null;
    to: number | null;
}

// Интерфейс для объекта стадии
interface Stage {
    id: number;
    name: string;
    from: number | null;
    to: number | null;
}

// Интерфейс для объекта сезона
interface Season {
    id: number;
    name: string;
    groups: Group[];
    stages: Stage[];
    from: number;
    to: number;
}

// Интерфейс для данных в основном объекте
interface Data {
    id: number;
    name: string;
    logo_path: string;
    current_season_id: number;
    current_stage_id: number | null;
    priority: number;
    country: string;
    seasons: Season[];
    sport_id: number;
    type: string;
    is_cup: boolean;
}

// Интерфейс для основного объекта ответа
interface leagueResponse {
    error: number;
    message: string;
    data: Data;
}