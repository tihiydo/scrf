import crypto from "crypto-js"

export const sleep = async (ms: number) => (
    new Promise((res) => {
        setTimeout(res, ms)
    })
)

export const encryptAes = (text: string | number, key: string) => {
    const str = text.toString();
    const ciphertext = crypto.AES.encrypt(str, key).toString();
    return ciphertext;
}

export const decryptAes = (text: string | number, key: string) => {
    const str = text.toString();
    const decryptedBytes = crypto.AES.decrypt(str, key);
    const decryptedText = decryptedBytes.toString(crypto.enc.Utf8);
    return decryptedText;
}

export const updateArrayObjectItem = <T extends Record<string, any>>({
    array, comparatorKey, updatingItem
}: {
    array: T[];
    updatingItem: T;
    comparatorKey: keyof T;
}): T[] => {
    return array.map(arrayItem => {
        if (arrayItem[comparatorKey] === updatingItem[comparatorKey]) {
            return updatingItem;
        }

        return arrayItem
    })
}


export function removeDuplicates<T extends Record<string, any>>(arr: T[], key: keyof T): T[] {
    // Use a set to track unique keys
    const seenKeys = new Set<T[keyof T]>();

    return arr.filter(item => {
        const keyValue = item[key];
        if (seenKeys.has(keyValue)) {
            return false;
        } else {
            seenKeys.add(keyValue);
            return true;
        }
    });
}

export const pickKeysFromObject = <
    K extends Array<keyof T>,
    T extends Record<string, any>,
>(
    keysToPick: K,
    obj: T | Partial<T>
): Pick<T, typeof keysToPick[number]> => {
    const result: Partial<T> = {};

    for (const key in obj) {
        if (keysToPick.includes(key as keyof T)) {
            result[key] = obj[key];
        }
    }

    return result as Pick<T, K[number]>;
}

export const safeParseJSON = (value: string) => {
    try {
        return JSON.parse(value) as any;
    } catch (error) {
        return value
    }
}

export const excludeKeysFromObject = <
    K extends Array<keyof T>,
    T extends Record<string, any>,
>(
    obj: T | Partial<T>,
    keysToExclude: K,
): Omit<T, typeof keysToExclude[number]> => {
    const result: Partial<T> = {};

    for (const key in obj) {
        if (!keysToExclude.includes(key as keyof T)) {
            result[key] = obj[key];
        }
    }

    return result as Omit<T, K[number]>;
};

export const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const truncateText = (text: string, maxLength: number) => {
    if (text) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.slice(0, maxLength) + "...";
    }
};

export function removeUndefinedKeys<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.keys(obj).reduce((acc, key) => {
      const typedKey = key as keyof T;
      if (obj[typedKey] !== undefined) {
        acc[typedKey] = obj[typedKey];
      }
      return acc;
    }, {} as Partial<T>);
  }

  export const encryptLiveStreamUrl = async (url : string) => {
    const time = Math.floor(Date.now() / 1000 / 3600) * 3600;
    const clientId = 'frank';
    const clientSecret = 'uXuMuFG6RZqKJhwPRDmrcplFlUnGjle7';
    const isVip = true;
    const uid = '12345';

    // Создание строки для подписи
    const message = `${clientId}${uid}${isVip ? 'true' : 'false'}${time}`;

    // Создание HMAC SHA-256
    const hmac = crypto.HmacSHA256(message, clientSecret);

    // Получение результата в формате base64
    const userVerifyCode = `${time}-` + crypto.enc.Base64.stringify(hmac);

    // ======= CLIENT SIDE ========
    const playUrl = new URL(url);
    playUrl.searchParams.append('client_id', clientId);
    playUrl.searchParams.append('uid', uid);
    playUrl.searchParams.append('is_vip', isVip ? 'true' : 'false');
    playUrl.searchParams.append('verify', userVerifyCode);

    return playUrl.toString()
};