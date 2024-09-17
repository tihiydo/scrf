'use client';

import React, { useState } from 'react';
import styles from './read-more.module.scss';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';

type Props = {
  description: string;
  maxChars: number;
};

const ReadMore = ({ description, maxChars = 100 }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = isExpanded ? description : description.slice(0, maxChars);

  return (
    <div>
      <p>
        {displayText}
        {!isExpanded && description.length > maxChars && '...'}
      </p>
      {description.length > maxChars && (
        <button onClick={toggleReadMore} className={classNames(styles.text, { [`${styles.textActive}`]: isExpanded })}>
          {isExpanded ? 'Read less' : 'Read more'}
          <motion.div
            className={styles.triggerIconMotion}
            animate={{ rotate: isExpanded ? -180 : 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <ChevronDownIcon className={styles.iconMotion} />
          </motion.div>
        </button>
      )}
    </div>
  );
};

export default ReadMore;