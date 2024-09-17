import React from 'react'
import { ControlsButton } from '../ui/controls-button'
import { CastIcon } from 'lucide-react'
import { observer } from 'mobx-react-lite';
// import { googleCastStore } from '../../stores/google-cast';

type Props = {
  src: string;
}

const GoogleCast = ({ src }: Props) => {
  return (
    <ControlsButton
      onClick={() => {
        // googleCastStore.startCasting(src);

      }}
    >
      <CastIcon />
    </ControlsButton>
  )
}

export default observer(GoogleCast)