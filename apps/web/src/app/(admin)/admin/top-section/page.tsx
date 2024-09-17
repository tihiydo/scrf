'use client'

import { FilmsSearch } from "./_components/films-search"
import styles from './page.module.scss'
import React, { useEffect, useState } from "react"
import { Movie } from "@/entities/movie"
import { FilmModal } from "./_components/film-modal"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { updateArrayObjectItem } from "@/utils"
import { Select } from "@/components/ui/select"
import { TopSection, TopSectionPage } from "@/entities/top-section"
import { Button } from "@/components/ui/button"
import { AxiosInternalApiError } from "@/types"
import { message } from "antd"
import { apiClient } from "@/app/api/client"

const Page = () => {
  const [searchStr, setSearchStr] = useState('');
  const queryClient = useQueryClient();
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<TopSectionPage>('Home');

  const topSectionFilmsQuery = useQuery({
    queryKey: ['admin/top-section/get', page],
    queryFn: async () => {
      const response = await apiClient.get<TopSection>(`/top-section/${[page]}`)

      return response.data;
    },
  })

  const saveFilmsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<TopSection>(`/top-section/${page}`, {
        movies: selectedMovies.map(movie => movie.imdbid)
      })

      return response.data;
    },
    onSuccess: (updatedTopSection) => {
      queryClient.setQueryData(['admin/top-section/get', updatedTopSection.page], (_prevData: TopSection) => {
        return updatedTopSection
      })

      setSelectedMovies(updatedTopSection.movies)
    },
    onError: (error: AxiosInternalApiError) => {
      message.error(error.response?.data.message)
    },
  })

  useEffect(() => {
    if (!topSectionFilmsQuery.data) return;

    setSelectedMovies(topSectionFilmsQuery.data.movies);
  }, [topSectionFilmsQuery.data])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Top section</h1>

      <Select<TopSectionPage>
        classNames={{
          container: styles.selectContainer,
          trigger: styles.selectTrigger
        }}
        value={page}
        unselectable={false}
        onChange={(option) => {
          setPage(option?.value!)
        }}
        options={[
          {
            label: 'Home',
            value: 'Home'
          },
          {
            label: 'Films Category',
            value: 'FilmsCat'
          },

          {
            label: 'Serials Category',
            value: 'SerialsCat'
          },
          {
            label: 'Collections',
            value: 'Collections'
          }
        ]}
      />
      <div className={styles.filmsSelect}>
        <FilmsSearch
          searchStr={searchStr}
          setSearchStr={setSearchStr}
          selectedMovies={selectedMovies}
          onClick={(movie) => {
            if (selectedMovies.some(m => m.imdbid === movie.imdbid)) {

              setSelectedMovies(movies => (
                movies.filter(m => m.imdbid !== movie.imdbid)
              ))
              return
            }

            setSelectedMovies([...selectedMovies, movie])
          }}
        />

        <div className={styles.selectedFilms}>
          <h3 className={styles.selectedFilmsTitle}>Selected Films</h3>
          <div className={styles.selectedFilmsList}>
            {selectedMovies.map(movie => (
              <FilmModal
                key={movie.imdbid}
                onRemove={() => {
                  setTimeout(() => {
                    setSelectedMovies(movies => {
                      return movies.filter(m => m.imdbid !== movie.imdbid)
                    })
                  }, 300)
                }}
                onSave={(updatedMovie) => {
                  queryClient.setQueryData(['admin/films/search', searchStr], (prevData: { movies: Movie[] }) => {
                    return {
                      movies: updateArrayObjectItem({ array: prevData.movies, comparatorKey: 'imdbid', updatingItem: updatedMovie })
                    }
                  })

                  setSelectedMovies(movies => {
                    return updateArrayObjectItem({
                      array: movies,
                      comparatorKey: 'imdbid',
                      updatingItem: updatedMovie
                    })
                  })
                }}
                movie={movie}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.save}>
        <Button
          className={styles.saveBtn}
          variant={'pimary'}
          isLoading={saveFilmsMutation.isPending}
          disabled={selectedMovies.every((selectedMovie, index) => {
            const topSectionMovie = topSectionFilmsQuery.data?.movies[index];

            return selectedMovie.imdbid === topSectionMovie?.imdbid
          }) && selectedMovies.length === topSectionFilmsQuery.data?.movies.length || selectedMovies.some(movie => !movie.previewVideoUrl)}
          onClick={() => {
            saveFilmsMutation.mutate();

          }}
        >
          Save films
        </Button>
      </div>
    </div>
  )
}

export default Page