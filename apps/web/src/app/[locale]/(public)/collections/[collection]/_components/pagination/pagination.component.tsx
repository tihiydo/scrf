'use client'

import { Pagination } from 'antd'
import styles from './pagination.module.scss'
import { useCollectionQueryParamsContext } from '../../_query-params-context/use-collection-params-contenxt';

type Props = {
    pages: number;

}

const CollectionPagination = ({ pages }: Props) => {
    const { searchParams, setSearchParams } = useCollectionQueryParamsContext();
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
                showSizeChanger={false}
                hideOnSinglePage
            />
        </div>
    )
}

export default CollectionPagination