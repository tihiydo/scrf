// ! breaks position fixed

// 'use client';

// import { PageTransitionKeys, PageTransitionType, parseTransitionTypeString } from '@/components/utils/page-transition';
// import { motion } from 'framer-motion';
// import { useSearchParams } from 'next/navigation';

// export default function Template({ children }: { children: React.ReactNode }) {
//   const searchParams = useSearchParams();

//   const transitionSearchParams: Partial<Record<ExtendString<PageTransitionKeys>, string>> = {};

//   searchParams.forEach((v, k) => {
//     transitionSearchParams[k] = v;
//   })

//   // const exitTransitionType = parseTransitionTypeString(transitionSearchParams[PageTransitionKeys.ExitTransitionType]);

//   // if (exitTransitionType === PageTransitionType.None) return children;


//   // TODO: handle duration and animation type from transitionSearchParams 

//   return (
//     <motion.div
//       initial={{ y: 100, opacity: 0, filter: 'blur(12px)' }}
//       animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
//       exit={{ y: -100, opacity: 0, filter: 'blur(12px)' }}
//       transition={{ ease: 'easeInOut', duration: 0.5 }}
//     >
//       {children}
//     </motion.div>
//   );
// }

import React from 'react'


const Template = ({ children }: { children: React.ReactNode }) => {
  return (
    children
  )
}

export default Template