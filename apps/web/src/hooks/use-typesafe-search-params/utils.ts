import { PREFIXES, SEPARATOR } from "./constants";

export namespace SearchParametersSerializer {
    export function serialize(param: any): Maybe<string> {
        if (typeof param === 'string') {
            return PREFIXES.STRING + SEPARATOR + param
        }

        else if (typeof param === 'number' && !Number.isNaN(param)) {
            return PREFIXES.NUMBER + SEPARATOR + param.toString()
        }

        else if (typeof param === 'boolean') {
            const booleanString = param ? 'true' : 'false';
            return PREFIXES.BOOLEAN + SEPARATOR + booleanString
        }

        else if (param instanceof Date) {
            const dateString = param.getTime().toString()
            return PREFIXES.DATE + SEPARATOR + dateString
        }

        else if (param instanceof Array) {
            return PREFIXES.ARRAY + SEPARATOR + JSON.stringify(param)
        }

        else if (typeof param === 'object' && !Array.isArray(param) && param !== null) {
            return PREFIXES.MAP + SEPARATOR + JSON.stringify(param)
        }
        else {
            console.warn('Could not serialize value to search params string', param)
        }
    }

    export function deserialize(param?: string): any {
        try {
            if (typeof param === 'undefined') {
                throw new Error('Invalid param')
            }
            const paramTypePrefix = param.split(SEPARATOR)[0];
            const paramValue = param.split(SEPARATOR).slice(1).join(SEPARATOR);

            const isValidType = Object.values(PREFIXES).some(typePrefix => typePrefix === paramTypePrefix);
            if (!isValidType || !paramTypePrefix) {
                throw new Error('Invalid type prefix')
            }


            const typePrefix = paramTypePrefix as ObjectValues<typeof PREFIXES>;

            if (typePrefix === PREFIXES.STRING) {
                return paramValue;
            }

            if (typePrefix === PREFIXES.NUMBER) {
                const numberParam = Number(paramValue)
                if (Number.isNaN(numberParam)) {
                    throw new Error('Invalid number value')
                }

                return numberParam;
            }

            if (typePrefix === PREFIXES.BOOLEAN) {
                if (paramValue === 'false') {
                    return false;
                } else if (paramValue === 'true') {
                    return true
                } else {
                    throw new Error('Invalid boolean value')
                }
            }

            if (typePrefix === PREFIXES.DATE) {
                const millis = Number(paramValue);
                if (Number.isNaN(millis)) {
                    throw new Error('Invalid date value')
                }

                return new Date(millis)
            }

            if (typePrefix === PREFIXES.ARRAY) {
                const parsedArray = JSON.parse(paramValue ?? "[]");
                if (!(parsedArray instanceof Array)) {
                    throw new Error('Invalid array type')
                }

                return parsedArray;
            }

            if (typePrefix === PREFIXES.MAP) {
                const parsedMap = JSON.parse(paramValue ?? "{}");
                if (typeof parsedMap !== 'object' || Array.isArray(parsedMap) || parsedMap === null) {
                    throw new Error('Invalid map type')
                }

                return parsedMap;
            }
        } catch (error) {
            console.warn('Could not deserialize search param', (error as any)?.message)
        }
    }
}

