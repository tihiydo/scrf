import { GlobalSearch } from '@/api/requests/search'
import styles from './result.module.scss';
import classNames from 'classnames';
import { globalSearchStore } from '@/stores/global-search-store';
import { MiniFictionCard } from '@/components/mini-fiction-card';

type Props = {
  className?: string;
  data?: GlobalSearch.ResponseData;
}

const Results = ({ data, className }: Props) => {


  return (
    <div className={classNames(styles.results, className, 'no-scrollbar')}>
      {data?.movies?.length ? (
        <div className={styles.section}>
          <h5 className={styles.sectionTitle}>Movies</h5>
          <div className={styles.sectionList}>
            {(data?.movies ?? []).map(movie => (
              <MiniFictionCard
                link={`/movie/${movie.imdbid}`}
                key={movie.imdbid}
                onClick={() => globalSearchStore.toggleOpen(false)}
                title={movie.title}
                description={[movie.releaseYear, ...movie.fiction?.genres?.map(genre => genre.genreName) ?? []].join(', ')}
                previewImage={movie.portraitImage}
              />
            ))}
          </div>
        </div>
      ) : null}

      {data?.serials?.length ? (
        <div className={styles.section}>
          <h5 className={styles.sectionTitle}>Serials</h5>
          <div className={styles.sectionList}>
            {data.serials.map(serial => (
              <MiniFictionCard
                link={`/serial/${serial.imdbid}`}
                onClick={() => globalSearchStore.toggleOpen(false)}
                key={serial.imdbid}
                title={serial.title}
                description={[serial.releaseYear, ...serial.fiction?.genres?.map(genre => genre.genreName) ?? []].join(', ')}
                previewImage={serial.portraitImage}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Results