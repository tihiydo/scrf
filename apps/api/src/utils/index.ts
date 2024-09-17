import axios from 'axios';
import { Response } from 'express';
export function removeKeysFromObject<
  T extends Record<string, any>,
  R extends (keyof T)[],
>(obj: T, keysToRemove: R): Omit<T, R[number]> {
  const newObj: Partial<T> = { ...obj };
  keysToRemove.forEach((key) => {
    delete newObj[key];
  });
  return newObj as Omit<T, R[number]>;
}

export function goodResponse(res: Response, message?: string) {
  const obj : {status: boolean, message?: string} = {status: true}

  if(message)
  {
    obj.message = message
  }
  return res.status(200).json(obj);
}

export function errorResponse(res: Response, message?: string) 
{
    return res.status(503).json({ status: false, message: message !== undefined ? message : "Unknown error"});
}

export async function imdbApi(
  methodGroup: string,
  method: string,
  version: null | string,
  params: object,
) {
  try {
    console.log(
      `https://imdb8.p.rapidapi.com/${methodGroup}${typeof version == 'string' ? '/' + version : ''}/${method}`,
    );
    const response = await axios.request({
      method: 'GET',
      url: `https://imdb8.p.rapidapi.com/${methodGroup}${typeof version == 'string' ? '/' + version : ''}/${method}`,
      params: { ...params, country: 'US', language: 'en-US' },
      headers: {
        'x-rapidapi-key': 'd88f8ec336msh1b8210ee8e97159p1e9044jsna8c06de742db',
        'x-rapidapi-host': 'imdb8.p.rapidapi.com',
      },
    });
    return response.data;
  } catch (error) {
    console.error('IM DB API FETCH ERROR: ', error);
    return undefined;
  }
}

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function removeDuplicates<T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
): T[] {
  // Use a set to track unique keys
  const seenKeys = new Set<T[keyof T]>();

  return arr.filter((item) => {
    const keyValue = item[key];
    if (seenKeys.has(keyValue)) {
      return false;
    } else {
      seenKeys.add(keyValue);
      return true;
    }
  });
}

export function ensureObject<T>(obj: T | undefined, defaultValue: T): T {
  return obj !== undefined ? obj : defaultValue;
}

export function mergeDeep(target: any, source: any): any {
  if (!target) {
    target = {};
  }

  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !(source[key] instanceof Array)) {
      target[key] = mergeDeep(ensureObject(target[key], {}), source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

export function parseFullInt(str: string) {
  const regex = /^\d+$/;
  if (regex.test(str)) {
    return parseInt(str, 10);
  }
  return NaN;
}

export function parseStringNumber(value: Maybe<string>, defaultValue: number) {
  const parsedValue = value?.length > 0 ? Number(value) : NaN;

  return !Number.isNaN(parsedValue) ? parsedValue : defaultValue;
}
