import { FictionSwiper } from '@/components/swipers'
import { Link } from '@/i18n/navigation'
import classNames from 'classnames'
import styles from '../../page.module.scss'
import { MoreFiction } from '@/components/hide-more-fiction'
import { apiServer } from '@/app/api/server'
import { headers } from 'next/headers'
import { MinimalMovieOptimize } from '@/entities/movie'
import WrapperBlock from '@/components/wrapper-block/wrapper-block'

type Props = {}

const MoviesSection = async (props: Props) => {
    const moviesNewResponse = (await apiServer(headers).get<
        (MinimalMovieOptimize & { trandRating?: number })[]
    >('/movies/new')).data;

    const moviesPopularResponse = (await apiServer(headers).get<
        (MinimalMovieOptimize & { trandRating?: number })[]
    >('/movies/popular')).data

    const moviesRandomResponse = (await apiServer(headers).get<
    (MinimalMovieOptimize & { trandRating?: number })[]
    >('/movies/random')).data

    const moviesRandomResponseTwo = (await apiServer(headers).get<
    (MinimalMovieOptimize & { trandRating?: number })[]
    >('/movies/random')).data

    const moviesWithTrandRating = moviesRandomResponseTwo
        .map((el) => {
            const getWeightByTime = (
                releaseDateUnix: number,
                maxDays: number = 365
            ): number => {
                const currentTimeUnix = Date.now() / 1000;

                const elapsedDays =
                    (currentTimeUnix - releaseDateUnix) / (60 * 60 * 24);

                let weight: number;
                if (elapsedDays >= maxDays) {
                    weight = 0;
                } else {
                    weight = 1 - elapsedDays / maxDays;
                }
                return weight + 0.5;
            };

            const weightByTime = getWeightByTime(
                new Date(el.releaseDate).getTime() / 1000
            );
            el.trandRating = weightByTime * el.rating;
            return el;
        })
        .sort(
            (a, b) =>
                (b.trandRating ? b.trandRating : 0) -
                (a.trandRating ? a.trandRating : 0)
        );
    const movieSortedByRating = [...moviesPopularResponse].sort(
        (a, b) => b.rating - a.rating
    );
    const movieSortedByRelease = [...moviesNewResponse].sort(
        (a, b) =>
            new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    );


    return (
        <WrapperBlock className={classNames('container', styles.fictionMargin)}>
            <section
            >
                <h3
                    className={styles.fictionTitle}
                >
                    <Link href={"/categories/films"} className={styles.fictionTitleLink}>
                        Films
                    </Link>
                </h3>

                <FictionSwiper
                    fictions={moviesRandomResponse.sort(
                        (a, b) =>
                            new Date(b.releaseDate).getTime() -
                            new Date(a.releaseDate).getTime()
                    )}
                />

                <MoreFiction
                    sliders={[
                        {
                            title: 'POPULAR',
                            fictionSlider: {
                                fictions: movieSortedByRating
                            }
                        },
                        {
                            title: 'NEW',
                            fictionSlider: {
                                fictions: movieSortedByRelease,
                            }
                        },
                        {
                            title: "TRAND",
                            fictionSlider: {
                                fictions: moviesWithTrandRating,
                            }
                        }
                    ]}
                />
            </section>
        </WrapperBlock>
    )
}

export default MoviesSection