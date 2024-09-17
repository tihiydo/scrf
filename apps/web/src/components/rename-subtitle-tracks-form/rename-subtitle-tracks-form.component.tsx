'use client'

import styles from './rename-subtitle-tracks-form.module.scss'
import RenameForm from './rename-form'
import { GetSubtitleTracks } from '@/entities/subtitle-track/requests/get-tracks'
import { EyeOffIcon } from 'lucide-react'
import classNames from 'classnames'

type Props = {
    imdbid: string
}

const RenameSubtitleTracksForm = ({ imdbid }: Props) => {
    const subtitleTracksQuery = GetSubtitleTracks.useQuery({
        imdbid
    })

    return (
        <div className={styles.content}>
            <div className={styles.head}>
                <h5 className={styles.headTitle}>Original name</h5>

                <p className={styles.headRename}>Rename</p>
            </div>

            {subtitleTracksQuery.data?.map(subtitleTrack => (
                 <div className={classNames(styles.item, !subtitleTrack.visible && styles.itemHidden)}>
                 <div className={styles.itemTitle}>
                     {!subtitleTrack.visible ? (
                         <EyeOffIcon className={styles.itemHiddenIcon} />
                     ) : null}
                     <h5 className={styles.itemTitleText}>{subtitleTrack.originalName}</h5>
                 </div>



                 <RenameForm track={subtitleTrack} />
             </div>
            ))}
        </div>
    )
}

export default RenameSubtitleTracksForm