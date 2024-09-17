import { resolutionQuality } from "../../../stores/levels-store";
import { LevelData, LevelType } from "../../../types"
import { SettingSelectOption } from "../ui/select-option";
import styles from './settings-pages.module.scss'

type Props = {
  levels: LevelData[];
  activeType: LevelType;
  onSelect?: (level?: Maybe<LevelType>) => void;
}


const QualitySettings = ({ activeType, levels, onSelect }: Props) => {
  return (
    <div>
      <div className={styles.settingsPageHead}>
        <h4 className={styles.settingsPageTitle}>current playback speed</h4>
        <p className={styles.settingsPageSelected}>({resolutionQuality[activeType]})</p>
      </div>

      <ul className={styles.settingsPageList}>
        <SettingSelectOption
          className={styles.settingsPageOption}
          onClick={() => {
            onSelect?.('auto');
          }}
          selected={activeType === 'auto'}
        >
          Auto
        </SettingSelectOption>


        {levels.map((opt) => (
          <SettingSelectOption
            key={opt.id}
            className={styles.settingsPageOption}
            onClick={() => {
              onSelect?.(opt.type);
            }}
            selected={opt.type === activeType}
          >
            {resolutionQuality[opt.type]}
          </SettingSelectOption>
        ))}
      </ul>
    </div>
  )
}

export default QualitySettings