import PlaybackIcon from '@/components/icons/playback-icon'
import styles from './playback-rate.module.scss'
import { DropdownSelect } from '@/components/ui/dropdown-select'
import { ControlsButton } from '../ui/controls-button'

type PlaybackRateType = 1 | 2 | 3;

type Props = {
  playbackRate: PlaybackRateType;
  onChange: (newRate: PlaybackRateType) => void
}
const PlaybackRate = ({ playbackRate, onChange }: Props) => {
  return (
    <DropdownSelect<PlaybackRateType>
      position='top-left'
      value={playbackRate}
      onChange={(value) => {
        onChange?.(value);
      }}
      classNames={{
        item: styles.item
      }}
      options={[
        {
          label: '1x',
          value: 1
        },
        {
          label: '2x',
          value: 2
        },
        {
          label: '3x',
          value: 3
        },
      ]}
    >
      <ControlsButton className={styles.btn}>
        <PlaybackIcon className={styles.icon} />
      </ControlsButton>
    </DropdownSelect>
  )
}

export default PlaybackRate