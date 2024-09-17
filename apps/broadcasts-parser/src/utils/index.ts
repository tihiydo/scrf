export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function objectToQueryParams(obj: Record<string, any>): string {
    const params = new URLSearchParams();

    // Пройтись по ключам объекта и добавить их как параметры
    for (const [key, value] of Object.entries(obj)) {
        // Если значение является массивом, добавить его как несколько параметров
        if (Array.isArray(value)) {
            value.forEach(val => params.append(key, String(val)));
        } else {
            params.append(key, String(value));
        }
    }

    return params.toString();
}

export const getTwoDays = async () =>
{
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const timestamp = Math.floor(startOfDay.getTime() / 1000);
    
    // Создаем новый объект даты для начала следующего дня
    const startOfNextDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    const timestampNextDay = Math.floor(startOfNextDay.getTime() / 1000);
    return [
      timestamp,
      timestampNextDay
    ]
    
} 