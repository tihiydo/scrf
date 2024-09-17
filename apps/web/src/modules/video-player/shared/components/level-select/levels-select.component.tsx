import { DropdownSelect } from '@/components/ui/dropdown-select'
import styles from './levels-select.module.scss'
import { observer } from 'mobx-react-lite'
import { LevelType, LevelData } from '../../types'
import { QualityIcon } from '../ui/quality-icon'
import { resolutionQuality } from '../../stores/levels-store'


type Props = {
  levels: LevelData[];
  activeType: LevelType;
  onChange?: (level?: Maybe<LevelType>) => void;
}



const LevelsSelected = ({ levels, activeType, onChange }: Props) => {

  return (
    <div className={styles.container}>
      <DropdownSelect<Maybe<LevelType>>
        position='bottom-right'
        value={activeType}
        onChange={(newResolutionType) => {
          onChange?.(newResolutionType);
        }}
        options={[
          {
            label: <p key={'auto'} className={styles.qualityItem}>
              {resolutionQuality['auto']}
            </p>,
            value: 'auto'
          },
          ...levels.map(resolution => ({
            label: <p key={resolution.type} className={styles.qualityItem}>
              {resolutionQuality[resolution.type]}
            </p>,
            value: resolution.type
          }))
        ]
        }
      >
        <button className={styles.btn}>
          <QualityIcon />
          <p className={styles.btnText}>Quality ({resolutionQuality[activeType]})</p>
        </button>
      </DropdownSelect>
    </div>
  )
}

export default observer(LevelsSelected)