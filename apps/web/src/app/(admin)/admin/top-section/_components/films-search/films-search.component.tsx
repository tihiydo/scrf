
import { LoadingIcon } from '@/components/icons/loading-icon'
import { Movie } from '@/entities/movie'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { Input } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './films-search.module.scss'
import Image from 'next/image'
import { CheckIcon } from 'lucide-react'
import classNames from 'classnames'
import { FilmItem } from '../film-item'
import { apiClient } from '@/app/api/client'

type Props = {
    onClick: (movie: Movie) => void;
    selectedMovies: Movie[];
    searchStr: string;
    setSearchStr: (value: string) => void;
}

const FilmsSearch = ({ onClick, selectedMovies, setSearchStr, searchStr }: Props) => {
    const debouncedSearch = useDebounce(searchStr, 1000);

    const searchQuery = useQuery<{ movies: Movie[] }>({
        enabled: false,
        queryKey: ['admin/films/search', debouncedSearch],
        queryFn: async () => {
            const response = await apiClient.get('/search', {
                params: {
                    entities: 'movie',
                    searchStr: debouncedSearch
                }
            })

            return response.data;
        }
    })


    useEffect(() => {
        searchQuery.refetch();
    }, [debouncedSearch])


    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Search films</h3>

            <Input
                value={searchStr}
                onChange={(e) => {
                    setSearchStr(e.target.value)
                }}
            />
            {searchQuery.isLoading ? (
                <div className={styles.loading}>
                    <LoadingIcon className={styles.loadingIcon} />
                </div>
            ) : (
                <div className={styles.results}>
                    {searchQuery.data?.movies.map(movie => {
                        const isActive = selectedMovies.some(m => m.imdbid === movie.imdbid);

                        return (
                            <FilmItem
                                key={movie.imdbid}
                                onClick={() => {
                                    onClick(movie)
                                }}
                                isActive={isActive}
                                movie={movie}
                            />
                        )
                    })}
                </div>
            )
            }
        </div >
    )
}

export default FilmsSearch