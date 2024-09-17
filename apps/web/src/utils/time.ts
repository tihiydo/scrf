import { format as formatTZ, toZonedTime } from 'date-fns-tz';
import { addSeconds, format } from 'date-fns';
import { uk } from 'date-fns/locale';

export const formatDate = (date: Date | null) => {
    if (date == null) {
        return "Unknown";
    } else {
        const timeZone = 'Europe/Kiev'; // Часовой пояс Украины
        const zonedDate = toZonedTime(date, timeZone);
        return formatTZ(zonedDate, 'dd.MM.yyyy HH:mm', { locale: uk });
    }
};


export function formatTime(time: Partial<{ hours: number; minutes: number; seconds: number }>): string {
    const { minutes = 0, seconds = 0 } = time;
    const formatNumber = (num: number): string => num.toString().padStart(2, '0');

    return `${formatNumber(minutes)}:${formatNumber(seconds)}`;
}

export function secondsToFormattedString(seconds: number) {
    const minutes = seconds / 60;

    if (minutes < 0) {
        throw new Error("Minutes cannot be negative");
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    let result = '';

    if (hours > 0) {
        result += `${hours}h`;
    }

    if (remainingMinutes > 0) {
        if (result) {
            result += ' ';
        }
        result += `${remainingMinutes}min`;
    }

    return result || '0min';
}

export function secondsToRuntimeString(seconds: number) {
    // Compute hours, minutes, and seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Format hours, minutes, and seconds to have two digits
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Combine into HH:MM:SS or MM:SS based on the presence of hours
    return hours > 0
        ? `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
        : `${formattedMinutes}:${formattedSeconds}`;
}

export const calculateDaysFrom = (dateString: string) => {
	const givenDate = new Date(dateString);

	const currentDate = new Date();

	const timeDifference = givenDate.getTime() - currentDate.getTime();

	const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

	return daysDifference;
};

export function formatUnixTime(unixTime: number): string {
    const date = new Date(unixTime * 1000);

    // Obtain the user's local time zone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Create a formatter with the local time zone
    const formatter = new Intl.DateTimeFormat(undefined, {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZoneName: 'short'
    });

    // Format the date
    const formattedDate = formatter.format(date);

    // Extract the necessary parts
    const [day, time, gmt] = formattedDate.split(/[\s,\/]+/);
    if(time)
    {
        return `${day} ${time}`;
    }
    else
    {
        return ""
    }
}
