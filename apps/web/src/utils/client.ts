export const getWindow = () => {
    return typeof window === 'undefined'
        ? undefined
        : window
}

export const getLocalStorage = () => {
    return typeof localStorage === 'undefined'
        ? undefined
        : localStorage
}