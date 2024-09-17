'use client';

import { useEffect } from 'react'
import { watchAccessStore } from '../../stores/watch-access-store';
import { useUnmount } from '@/hooks/use-unmount';
import { observer } from 'mobx-react-lite';

type Props = {
    children?: React.ReactNode;
    mediaId: string;
    mediaType: 'serial' | 'movie' | 'live';
    watchAccessEnabled?: boolean;
}

const AccessProvider = ({ mediaId, mediaType, children, watchAccessEnabled = true }: Props) => {
    useEffect(() => {
        if (!watchAccessEnabled) {
            watchAccessStore.setAccess('granted')

            return;
        };


        watchAccessStore.connect(mediaId, mediaType)

        const handleUnload = () => {
            watchAccessStore.manualUngrant();
        }

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);

            watchAccessStore.manualUngrant();
            watchAccessStore.disconnect()
        }
    }, [mediaId, mediaType])



    return children;
}

export default observer(AccessProvider)