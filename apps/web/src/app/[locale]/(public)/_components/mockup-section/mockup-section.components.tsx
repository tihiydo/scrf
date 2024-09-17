'use client'

import classNames from "classnames"
import styles from "./page.module.scss";
import Image from "next/image";
import pcImage from "@/assets/images/PC.png";
import laptopmobile from "@/assets/images/laptopmobile.png"
import laptopImage from "@/assets/images/laptop.png";
import phoneImage from "@/assets/images/phone.png";
import phoneMobileImage from "@/assets/images/phoneMobileImage.png"
import WrapperBlock from "@/components/wrapper-block/wrapper-block";
import { useMediaQuery } from "@/hooks/use-media-query";


type Props = {}


const MockUp = (props: Props) => {


    const isLarge = useMediaQuery('screen and (min-width: 375px)')

    return (
        <div className={styles.page}>
            <section className={classNames("container", styles.devices)}>

                <div className={styles.devicesItem}>
                    <Image
                        className={styles.devicesItemImage}
                        src={isLarge ? laptopImage : laptopmobile}
                        alt="device PC"
                        fill
                    />
                </div>
                <div className={styles.devicesItem}>
                    <Image
                        className={styles.devicesItemImage}
                        src={isLarge ? phoneImage : phoneMobileImage}
                        alt="device PC"
                        fill
                    />
                </div>
                <div className={styles.devicesItem}>
                    <Image
                        className={styles.devicesItemImage}
                        src={pcImage}
                        alt="device PC"
                        fill
                    />
                </div>
            </section>
        </div>
    )
}


export default MockUp