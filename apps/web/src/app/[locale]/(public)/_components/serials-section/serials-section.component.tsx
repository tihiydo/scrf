import { FictionSwiper } from '@/components/swipers'
import classNames from 'classnames'
import styles from '../../page.module.scss'
import { MoreFiction } from '@/components/hide-more-fiction'
import { headers } from 'next/headers'
import { Link } from '@/i18n/navigation'
import { SerialsLibrary } from '@/api/requests/serials/library'
import WrapperBlock from '@/components/wrapper-block/wrapper-block'

const Serials = async () => {
  const response = await SerialsLibrary.serverFetch(headers, {
    params: {
      take: 20
    }
  })
  const serials = response.data.serials;

  const serialsSortedByRating = [...serials].sort(
    (a, b) => b.rating - a.rating
  );
  const serialsSortedByRelease = [...serials].sort(
    (a, b) =>
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  );

  return (
    <WrapperBlock className={classNames('container', styles.fictionMargin)}>
      <section>
        <h3
          className={styles.fictionTitle}
        >
          <Link href={"/categories/serials"} className={styles.fictionTitleLink}>
            Serials
          </Link>
        </h3>

        <FictionSwiper fictions={serials} />

        <MoreFiction
          sliders={[
            {
              title: 'POPULAR',
              fictionSlider: {
                fictions: serialsSortedByRating,
              }
            },
            {
              title: 'NEW',
              fictionSlider: {
                fictions: serialsSortedByRelease,
              }
            },
            // {
            //   title: "TRAND",
            //   fictionSlider: {
            //     fictions: movieSortedByRelease,
            //   }
            // }
          ]}
        />
      </section>
    </WrapperBlock>

  )
}

export default Serials