'use client'


import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { useClickAway, useHover } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { HeartIcon, EyeIcon, CheckCheckIcon, Check, Plus } from "lucide-react";


import styles from "./add-button-card.module.scss";
import { AddListFiction } from "@/api/requests/lists/add-fiction";
import { Movie } from "@/entities/movie";
import { message } from "antd";
import { RemoveListFiction } from "@/api/requests/lists/remove-fiction";
import { GetFictionLists } from "@/api/requests/lists/get-fiction-lists";
import { List } from "@/entities/lists";
import { Serial } from "@/entities/serial";
import { isSerial } from "@/utils/fiction";
type RadioProps = {
  isChecked: boolean;
  value: string;
}

const Radio = ({ isChecked, value }: RadioProps) => {
  return (
    <div className={styles.radio__container}>
      <input type="checkbox" checked={isChecked} value={value} />
      <span className={styles.radio__checkmark}></span>
      <AnimatePresence>
        {isChecked && (
          <motion.div
            className={styles.galochka}
            exit={{ opacity: 1 }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.1,
              duration: 0.2,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            < Check className={styles.galochkaIcon} width={18} height={18} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


type Props = {
  fiction: (Movie | Serial)
  // not error ask Vlad
  // eslint-disable-next-line no-unused-vars
  onClick?: (e: any) => void
  className?: string;
}

export const AddButtonCard = ({ fiction, onClick, className }: Props) => {
  const [ref, hovering] = useHover()
  const [isDrawerOpened, setDrawerOpened] = useState(false);
  const [isOpen, setIsOpen] = useState(false);


  const [includedLists, setIncludedLists] = useState<Record<string, boolean>>({});
  const fictionType: 'serial' | 'movie' = isSerial(fiction)
    ? 'serial'
    : 'movie'

  const useAddToList = AddListFiction.useMutation({
    onError: (error) => {
      message.error(error.response?.data.message)
    },
    onSuccess: ({ list }) => {
      message.success(`"${fiction.title}" added to the list "${list.name}"`)
      listsQuery.refetch();
    }
  })

  const useRemoveFromList = RemoveListFiction.useMutation({
    onError: (error) => {
      message.error(error.response?.data.message)
    },
    onSuccess: ({ list }) => {
      message.success(`"${fiction.title}" from the list "${list.name}"`)
      listsQuery.refetch();
    }
  })

  const listsQuery = GetFictionLists.useQuery({
    fictionImdbid: fiction.imdbid
  })

  const isIncluded = (slug: string, lists: List[]) => {
    return lists.some(list => list.slug === slug)
  }

  useEffect(() => {
    if (!listsQuery.data) return;
    const lists = listsQuery.data.lists;
    setIncludedLists(() => ({
      saved: isIncluded('saved', lists),
      watching: isIncluded('watching', lists),
      viewed: isIncluded('viewed', lists),
    }))
  }, [listsQuery.data])

  const clickAwayRef = useClickAway<HTMLDivElement>((e) => {
    setIsOpen(false);
  });

  const onChange = (list: string) => {
    const isAdded = includedLists[list];

    if (isAdded) {
      useRemoveFromList.mutate({
        fictionImdbid: fiction.imdbid,
        type: fictionType,
        slug: list
      })
    } else {
      useAddToList.mutate({
        fictionImdbid: fiction.imdbid,
        type: fictionType,
        slug: list
      })

    }
  };


  return (
    <div className={classNames(styles.container,)} ref={clickAwayRef}
      onClick={(e) => {
        onClick?.(e)
      }}>
      <div className={styles.wrapper}>
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setDrawerOpened(!isDrawerOpened)
          }}
          className={classNames(styles.trigger)}
        >
          <Plus size={24} className={classNames(styles.triggerIcon, className, { [`${styles.triggerChanging}`]: isOpen })} />
        </button>
      </div>
      <div>
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              ref={ref}
              className={styles.popover}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, x: -100, y: 150 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.1,
                duration: 0.2,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <div className={styles.item} onClick={() => onChange("saved")}>
                <div>
                  <HeartIcon className={styles.itemIcon} />
                  <p className={styles.itemText}>Saved</p>
                </div>
                <Radio value="saved" isChecked={!!includedLists["saved"]} />
              </div>

              <div className={styles.item} onClick={() => onChange("watching")}>
                <div>
                  <EyeIcon className={styles.itemIcon} />
                  <p className={styles.item__text}>Watching</p>
                </div>
                <Radio value="watching" isChecked={!!includedLists["watching"]} />
              </div>

              <div className={styles.item} onClick={() => onChange("viewed")}>
                <div>
                  <CheckCheckIcon className={styles.itemIcon} />
                  <p className={styles.itemText}>Viewed</p>
                </div>
                <Radio value="viewed" isChecked={!!includedLists["viewed"]} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};
