// Интерфейс для данных внутри массива "data"
interface DataItem {
    id: number;
    name: string;
    priority: number;
    country: string | null;
    sport_id: number;
}

// Интерфейс для "meta" объекта
interface Meta {
    next: string;
    prev: string;
}

// Интерфейс для основного объекта ответа
interface leaguesResponse {
    error: number;
    message: string;
    data: DataItem[];
    meta: Meta;
}