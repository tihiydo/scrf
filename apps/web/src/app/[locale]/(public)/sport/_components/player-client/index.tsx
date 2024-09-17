"use client"

import React, { useEffect, useRef, useState } from 'react'
import Broadcasts from '../broadcasts'
import Player from '../player'
import Channels from '../channels'
import { Broadcast, LiveEvents } from '../../entitities'
import { encryptLiveStreamUrl } from '@/utils'
import { apiClient } from '@/app/api/client'

type Props = {}

const PlayerClient = (props: Props) => {
  const [liveChannel, setLiveChannel] = useState<Omit<Broadcast, "id">>({ channelName: "ESPN", channelLink: "https://cdn-rum.n2olabs.pro/partner-stream.m3u8?url=https%3A%2F%2Ffrank-iptv001.fzstream.com%2Flivetv%2F436%2Findex.m3u8" })
  const [matches, setMatches] = useState<LiveEvents[]>([])
  const myDivRef = useRef(null);

  const getMatches = async () => {
    const data = await apiClient.get<LiveEvents[]>("/events");

    const sortedData = data.data.sort((a, b) => {
      const aHasLive = a.liveStream !== null;
      const bHasLive = b.liveStream !== null;

      if (aHasLive && !bHasLive) return -1; // a с `live` идет перед b без `live`
      if (!aHasLive && bHasLive) return 1; // b с `live` идет перед a без `live`

      // Если оба либо с `live`, либо без `live`, сортируем по времени
      return a.startAt - b.startAt;
    }).sort((a, b) => {
      const aHasLive = a.liveStream !== null;
      const bHasLive = b.liveStream !== null;

      if (aHasLive && !bHasLive) return -1; // a с `live` идет перед b без `live`
      if (!aHasLive && bHasLive) return 1; // b с `live` идет перед a без `live`

      // Если оба либо с `live`, либо без `live`, сортируем по времени
      return a.startAt - b.startAt;
    });

    setMatches(sortedData);
  }

  const [sports, setSports] = useState<{ liveSports: { icon: string, id: number, name: string }[], sports: { icon: string, id: number, name: string }[] }>({ liveSports: [], sports: [] })

  const getSports = async () => {
    try {
      // Запрашиваем все категории спорта
      const sports = await apiClient.get("/events/sports");
      const response = sports.data as { icon: string, id: number, name: string }[];
      const liveMatches = matches.filter(el => el.liveStream != null);

      const filteredSports = response.filter(sport =>
        liveMatches.some(match => sport.id == match.sportId)
      );

      setSports({ liveSports: filteredSports, sports: response });
    } catch (error) {
      console.error("Ошибка при получении видов спорта:", error);
    }
  };

  useEffect(() => {
    getSports()
  }, [matches])

  useEffect(() => {
    getMatches()
  }, [])

  return (
    <div>
      <Broadcasts
        sports={sports}
        matches={matches.filter(el => el.liveStream !== null)}
        setLiveChannel={setLiveChannel}
        myDivRef={myDivRef}
      />
      <Player liveChannel={liveChannel} setLiveChannel={setLiveChannel} myDivRef={myDivRef} />
      <Channels
        sports={sports}
        liveChannel={liveChannel}
        setLiveChannel={setLiveChannel}
        matches={matches}
        myDivRef={myDivRef}
      />
    </div>
  )
}

export default PlayerClient