import { Movie } from '@/entities/movie';
import styles from './info-section.module.scss';
import { truncateText } from '@/utils';
import Image from 'next/image';
import classNames from 'classnames';
import { InfoTable } from '../../../../_components/info-table';
import WrapperBlock from '@/components/wrapper-block/wrapper-block';
import { apiServer } from '@/app/api/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

type Props = {
    movie: Movie;
    slug: string;
}

const InfoSection = async ({ movie, slug }: Props) => {

    const response = await apiServer(headers).get<any>(`/collections/fiction/${slug}`)
    const collections = response.data;

    return (

        <WrapperBlock className={classNames('container')}>
            <section >
                <h1 className={styles.title}>information</h1>
                <div className={styles.content}>
                    <InfoTable fiction={movie} collections={collections.length == 0 ? false : collections[0].collection.name} />

                    <div className={styles.imageContainer}>
                        <Image className={styles.image} src={movie?.portraitImage} width={1000} height={1000} alt={movie?.title} />
                    </div>
                </div>
            </section>
        </WrapperBlock>

    )
}

export default InfoSection