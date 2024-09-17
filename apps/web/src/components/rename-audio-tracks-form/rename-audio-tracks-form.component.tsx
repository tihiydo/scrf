'use client'

import { GetAudioTracks } from '@/entities/audio-track/requests/get-tracks'
import RenameForm from './rename-select'
import styles from './rename-audio-tracks-form.module.scss'
import classNames from 'classnames'
import { EyeOffIcon } from 'lucide-react'

type Props = {
    imdbid: string
}

const RenameAudioTracksForm = ({ imdbid }: Props) => {
    const audioTracksQuery = GetAudioTracks.useQuery({
        imdbid
    })

    return (
        <div className={styles.content}>
            <div className={styles.head}>
                <h5 className={styles.headTitle}>Original name</h5>


                <p className={styles.headRename}>Rename</p>
            </div>

            {audioTracksQuery.data?.map(audioTrack => (
                <div className={classNames(styles.item, !audioTrack.visible && styles.itemHidden)}>
                    <div className={styles.itemTitle}>
                        {!audioTrack.visible ? (
                            <EyeOffIcon className={styles.itemHiddenIcon} />
                        ) : null}
                        <h5 className={styles.itemTitleText}>{audioTrack.originalName}</h5>
                    </div>

                    <RenameForm track={audioTrack} />
                </div>
            ))}
        </div>
    )
}

export default RenameAudioTracksForm