export type movieFromApi = 
{
    data:
    {
        movie:
        {
            summary: string
            title: string
            slug: string
            runtime: number
            rating: number
            title_long: string
            description_intro: string
            description_full: string
        }
    }
}