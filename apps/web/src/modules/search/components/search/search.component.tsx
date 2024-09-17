'use client';

import { useEffect, useRef, useState } from "react";
import SearchInput from "../search-input/search-input";
import { AnimatePresence, motion } from "framer-motion";
import { Results } from "../results";
import styles from './search.module.scss'
import { useDebounce } from "@uidotdev/usehooks";
import { observer } from "mobx-react-lite";
import { GlobalSearch } from "@/api/requests/search";
import { globalSearchStore } from "@/stores/global-search-store";
import { InputRef } from "antd";

type Props = {
  close: () => void;
}

const Search = ({ close }: Props) => {
  const [resultsOpen, setResultsOpen] = useState(false);
  const debouncedSearchStr = useDebounce(globalSearchStore.searchStr, 500);
  const inputRef = useRef<InputRef>(null);

  const searchQuery = GlobalSearch.useQuery({
    searchString: debouncedSearchStr,
    params: {
      entities: ['movie', 'serial']
    }
  });

  useEffect(() => {
    if (searchQuery.isFetched) {
      setResultsOpen(true)
    }
  }, [searchQuery.isFetched])


  useEffect(() => {
    inputRef.current?.focus();

    return () => {
      globalSearchStore.setSearchStr('')
      setResultsOpen(false);
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <SearchInput
        ref={inputRef}
        value={globalSearchStore.searchStr}
        onChange={async (value) => {
          globalSearchStore.setSearchStr(value)
        }}
        onClose={() => {
          close?.()
          setResultsOpen(false);
        }}
      />


      <AnimatePresence>
        {resultsOpen ? (
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: .2, type: 'spring', stiffness: 260, damping: 20 }}
            className={styles.results}
          >
            <Results
              serials={searchQuery.data?.serials ?? []}
              movies={searchQuery.data?.movies ?? []}
              personalities={[]}
              studios={[]}
              closeSearch={close}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default observer(Search)