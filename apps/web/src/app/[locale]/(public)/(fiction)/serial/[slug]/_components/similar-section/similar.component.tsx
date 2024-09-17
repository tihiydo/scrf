'use client'

import { FictionSwiper } from "@/components/swipers";
import classNames from "classnames";
import sliderStyles from "@/app/[locale]/(public)/page.module.scss";
import { MoreFiction } from "@/components/hide-more-fiction";
import { Serial } from "@/entities/serial";
import { SerialsLibrary } from "@/api/requests/serials/library";
import WrapperBlock from "@/components/wrapper-block/wrapper-block";
import { GetSimilarSerials } from "@/api/requests/serials/similar";
import { GetAllActorsContent } from "@/api/requests/actor";

type Props = {
    serial: Serial;
}

const Similar = ({ serial }: Props) => {
    const similarMoviesQuery = GetSimilarSerials.useQuery({
        imdbid: serial.imdbid
    })

    const serials = similarMoviesQuery.data ?? [];

    console.log(serials)

    return (
        <>
            {serials.length !== 0
                ? <WrapperBlock className={classNames("container", sliderStyles.fictionFilms,)} >
                    <section>
                        <h3 className={sliderStyles.fictionTitle}>SIMILAR</h3>

                        <FictionSwiper fictions={serials} />

                    </section>
                </WrapperBlock >
                : null
            }
        </>
    )
}

export default Similar