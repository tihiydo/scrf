'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useContext, useRef } from 'react';
import { PageTransitionKeys, PageTransitionType } from './enum';
import { parseTransitionTypeString } from './utils';

function FrozenRouter(props: { children: React.ReactNode }) {
    const context = useContext(LayoutRouterContext ?? {});
    const frozen = useRef(context).current;

    if (!frozen) {
        return <>{props.children}</>;
    }

    return (
        <LayoutRouterContext.Provider value={frozen}>
            {props.children}
        </LayoutRouterContext.Provider>
    );
}


// Page exit animation
const PageTransitionEffect = ({ children }: { children: React.ReactNode }) => {
    const key = usePathname();
    const searchParams = useSearchParams();

    const transitionSearchParams: Partial<Record<ExtendString<PageTransitionKeys>, string>> = {};

    searchParams.forEach((v, k) => {
        transitionSearchParams[k] = v;
    })

    const exitTransitionType = parseTransitionTypeString(transitionSearchParams[PageTransitionKeys.ExitTransitionType]);

    // if no animation applied dont use framer motion API
    if (exitTransitionType === PageTransitionType.None) return children;

    return (
        <AnimatePresence mode="wait" >
            <motion.div
                key={key}
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={{
                    hidden: { opacity: 0, y: 100, filter: 'blur(12px)' },
                    enter: { opacity: 1, y: 0, filter: 'blur(0px)' },
                    exit: { opacity: 0, y: -100, filter: 'blur(12px)' },
                }}
                transition={{ ease: 'easeInOut', duration: 1 }}
            >
                <FrozenRouter>{children}</FrozenRouter>
            </motion.div>
        </AnimatePresence>
    );
};

export default PageTransitionEffect;
