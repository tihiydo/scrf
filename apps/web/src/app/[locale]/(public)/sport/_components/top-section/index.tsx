import { VideoSwiper } from '@/modules/video-swiper'
import React from 'react'

type Props = {}

const TopSection = (props: Props) => {
  return (
    <div className="video-swiper-container">
      <VideoSwiper page="Home" />
    </div>
  )
}

export default TopSection