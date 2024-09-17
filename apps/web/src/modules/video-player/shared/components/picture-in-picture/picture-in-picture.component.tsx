import PicInPicIcon from "@/components/icons/pic-in-pic-icon"
import styles from './picture-in-picture.module.scss'
import { observer } from "mobx-react-lite"
import { MonitorPlayIcon } from "lucide-react"
import classNames from "classnames"
import { ControlsButton } from "../ui/controls-button"

type Props = {
    enabled: boolean;
    onClick?: () => void;
}

const PictureInPicture = ({ enabled, onClick }: Props) => {
    return (
        <ControlsButton
            className={styles.btn}
            onClick={() => {
                onClick?.()
            }}
        >
            {enabled ? (
                <MonitorPlayIcon strokeWidth={1} className={classNames(styles.icon, styles.iconPipEnabled)} />
            ) : (
                <PicInPicIcon className={classNames(styles.icon, styles.iconPipDisabled)} />
            )}
        </ControlsButton>
    )
}

export default observer(PictureInPicture)