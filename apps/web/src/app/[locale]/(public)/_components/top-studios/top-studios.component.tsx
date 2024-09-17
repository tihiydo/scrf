'use client'

import { FictionSwiper } from '@/components/swipers'
import classNames from 'classnames'
import { MoreFiction } from '@/components/hide-more-fiction'
import { headers } from 'next/headers'
import { Link } from '@/i18n/navigation'
import { SerialsLibrary } from '@/api/requests/serials/library'
import hulu from "./hulu.svg"
import hbo from "./hbo.svg"
import ebene from "./ebene.svg"
import disney from "./disney.svg"
import netflix from "./netflix.svg"
import Image from 'next/image'
import styles from "./top-studios.module.scss";
import { useMediaQuery } from '@/hooks/use-media-query'
import { StudioSwiper } from './_components/studio-swiper'
import WrapperBlock from '@/components/wrapper-block/wrapper-block'




const TopStudios = () => {

    const isLarge = useMediaQuery('screen and (min-width: 768px')


    return (
        <section className={classNames("container", styles.studios)}>
            {/* {
                isLarge ? (
                    <div className={styles.studios}>
                        <Link href="/categories/films?studio=str-Netflix&page=num-1" >
                            <Image src={netflix} alt="" width={100} className={styles.imageNetflix} />
                        </Link>

                        <Link href="/categories/films?studio=str-HBO+Max&page=num-1">
                            <Image src={hbo} alt="" width={100} className={styles.imageHbo} />
                        </Link>

                        <Link href="/categories/films?studio=str-Amazon+Prime+Video&page=num-1">
                            <Image src={ebene} alt="" width={100} className={styles.imagePrime} />
                        </Link>
                        <Link href="/categories/films?studio=str-Walt+Disney+Pictures&page=num-1">
                            <Image src={disney} alt="" width={100} className={styles.imageDisnay} />
                        </Link>

                        <Link href="/categories/films?studio=str-Hulu+Originals&page=num-1">
                            <Image src={hulu} alt="" width={100} className={styles.imageHulu} />
                        </Link>
                    </div>
                ) : ( */}

            <StudioSwiper />
            {/* <Link href="/categories/films?studio=str-Netflix&page=num-1" >
                                    <Image src={netflix} alt="" width={100} className={styles.imageNetflix} />
                                </Link>

                                <Link href="/categories/films?studio=str-HBO+Max&page=num-1">
                                    <Image src={hbo} alt="" width={100} className={styles.imageHbo} />
                                </Link>

                                <Link href="/categories/films?studio=str-Amazon+Prime+Video&page=num-1">
                                    <Image src={ebene} alt="" width={100} className={styles.imagePrime} />
                                </Link> */}

            {/* )
            } */}
        </section>
    )
}

export default TopStudios