'use client'

import styles from '../../page.module.scss'
import { Button } from "@/components/ui/button"
import { message } from 'antd'
import classNames from "classnames"

type Props = {}

const TrailerBtn = () => {
    return (
        <div>
            <Button
                disabled
                variant="accent-outline"
                size={'xlT'}
                className={classNames(styles.button)}
                onClick={() => {
                    message.info('Coming soon')
                }}
            >
                TRAILER
            </Button>
        </div>
    )
}

export default TrailerBtn