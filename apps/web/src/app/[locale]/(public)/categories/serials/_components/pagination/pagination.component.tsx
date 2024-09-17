'use client'

import { Pagination } from 'antd'
import { useFiltersContext } from '../../_query-params/use-filters-contenxt';
import styles from './pagination.module.scss'

type Props = {
    pages: number;

}

const SerialsPagination = ({ pages }: Props) => {
    const { searchParams, setSearchParams } = useFiltersContext();
    const current: number = typeof searchParams.page === 'number'
        ? searchParams.page > pages
            ? pages
            : searchParams.page
        : 1

    return (
        <div className={styles.pagination}>
            <Pagination
                onChange={(page) => {
                    setSearchParams({
                        ...searchParams,
                        page
                    })
                }}
                current={current}
                defaultCurrent={1}
                total={pages}
                pageSize={1}
                hideOnSinglePage
            />
        </div>
    )
}

export default SerialsPagination