import styles from './info-section.module.scss';
import Image from 'next/image';
import classNames from 'classnames';
import { Serial } from '@/entities/serial';
import { InfoTable } from '../../../../_components/info-table';
import WrapperBlock from '@/components/wrapper-block/wrapper-block';
import { apiServer } from '@/app/api/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

type Props = {
    serial: Serial;
    slug: string;
}

const InfoSection = async ({ serial, slug }: Props) => {

    const response = await apiServer(headers).get<any>(`/collections/fiction/${slug}`)
    const collections = response.data;

    console.log(collections)

    return (
        <WrapperBlock className='container'>
            <section>
                <h1 className={styles.title}>information</h1>
                <div className={styles.content}>
                    <InfoTable fiction={serial} collections={collections.length == 0 ? false : collections[0].collection.name} />

                    <div className={styles.imageContainer}>
                        <Image className={styles.image} src={serial?.portraitImage} width={1000} height={1000} alt={serial?.title} />
                    </div>
                </div>
            </section>
        </WrapperBlock>
    )
}

export default InfoSection