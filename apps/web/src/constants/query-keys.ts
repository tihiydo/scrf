import { TopSectionPage } from "@/entities/top-section"


export const ADMIN_KEYS = {
    GET_USERS: 'admin/users',
    TOGGLE_BAN: 'admin/toggle-ban'
}

export const FILTERS_KEYS = {
    GET_GENRES: 'filters/get-genres',
}

export const SEARCH_KEY = 'search/all'
export const SIMILAR_FILMS_QUERY_KEY = 'client/similar-films'

export const getClientTopSectionKeys = (page: TopSectionPage) => ['client/top-section', page]