'use client'

import classNames from 'classnames'
import styles from './studio-section.module.scss'
import { Button } from '@/components/ui/button'
import screenifyFallback from '@/assets/images/fallback.png'
import { PictureFallback, PictureImage, PictureRoot } from '@/components/ui/picture'
import Image from 'next/image';
import { Studio } from '@/entities/studio';
import WrapperBlock from '@/components/wrapper-block/wrapper-block'
import router from 'next/router'

import { useRouter } from "@/i18n/navigation";


type Props = {
    studio: Studio
}

const StudioSection = ({ studio }: Props) => {


    const router = useRouter();

    const handleReadMoreClick = () => {
        router.push(`/studio/${studio.imdbid}`);
    };

    return (
        <WrapperBlock className={classNames('container', styles.section)}>
            <section className={classNames()}>
                <h3 className={styles.title}>Movie studio</h3>
                <div className={styles.content}>
                    <div className={styles.image}>
                        <PictureRoot>
                            <PictureImage src={screenifyFallback} alt="Studio" />
                            <PictureFallback >
                                <Image src={screenifyFallback} alt="Studio" />
                            </PictureFallback>
                        </PictureRoot>
                    </div>

                    <div className={styles.info}>
                        <h4 className={styles.infoTitle}>{studio.studioName}</h4>
                        <p className={styles.infoDescription}>{studio.description || 'No info'}</p>

                        <Button variant="pimary"
                            size={'xl'}
                            className={classNames(styles.infoBtn)}
                            onClick={handleReadMoreClick}
                        >
                            Read More
                        </Button>
                    </div>
                </div>
            </section>
        </WrapperBlock>
    )
}

export default StudioSection