import { BadRequestException } from '@nestjs/common';
import slugify from 'slugify';
import { sleep } from 'src/utils';
import { getExtendDetails } from 'src/utils/imdb8/get-extend-details';
import { getPlots } from 'src/utils/imdb8/get-plots';
import { getRatings } from 'src/utils/imdb8/get-ratings';
import { getSeasonEpisodes } from 'src/utils/imdb8/get-season-episodes';
import { getSeasons } from 'src/utils/imdb8/get-seasons';

type EpisodeData = {
  imdbid: string;
  title: string;
  slug: string;
  position: number;
  description?: string;
  releaseDate?: string;
  releaseYear?: number;
  portraitImage?: string;
  voteCount?: number;
  rating?: number;
  runtime?: number;
};

type SerialData = {
  imdbid: string;
  title: string;
  description?: string;
  fullDescription?: string;
  releaseYear?: number;
  totalEpisodes: number;
  endYear?: number;
  releaseDate?: string;
  portraitImage?: string;
  slug: string;
  voteCount?: number;
  rating?: number;
  seasonsCount: number;
  seasons: Array<{
    position: number;
    episodesCount: number;
    episodes: EpisodeData[];
  }>;
};

export class SeriesParser {
  serieImdbid: string;
  serial: SerialData | null;
  extendedDetails: any;

  constructor(imdbid: string) {
    this.serial = null;
    this.serieImdbid = imdbid;
    this.extendedDetails = null;
  }

  async parse() {
    const responseDetails = await getExtendDetails({
      imdbid: this.serieImdbid,
    });
    this.extendedDetails = responseDetails;

    const title = responseDetails?.data?.title?.originalTitleText?.text;
    if (!responseDetails?.data?.title?.titleType?.canHaveEpisodes) {
      throw new BadRequestException(`Fiction ${title} is not a serial`);
    }

    const releaseDate = new Date(
      responseDetails.data.title.releaseDate.year,
      responseDetails.data.title.releaseDate.month - 1,
      responseDetails.data.title.releaseDate.day,
    );
    const releaseYear = responseDetails?.data?.title?.releaseYear?.year;
    const endYear = responseDetails?.data?.title?.releaseYear?.endYear;
    const isoDateString = releaseDate.toISOString().split('T')[0];
    const portraitImage = responseDetails?.data?.title?.primaryImage?.url;
    const totalEpisodes =
      responseDetails?.data?.title?.episodes?.episodes?.total;
    const getTextResponse = await getPlots({ imdbid: this.serieImdbid });

    const fullDescription =
      getTextResponse?.data?.title?.plots?.edges?.[0]?.node?.plotText
        ?.plainText;
    const description = getTextResponse?.data?.title?.plot?.plotText?.plainText;

    const responseRating = (await getRatings({ imdbid: this.serieImdbid })).data
      .title.ratingsSummary;

    const voteCount = responseRating.voteCount;
    const rating = responseRating.aggregateRating;

    const generatedSlug =
      slugify(title, {
        replacement: '-',
        remove: undefined,
        lower: true,
        locale: 'en',
      }) +
      '-' +
      Math.floor(Math.random() * 10).toString() +
      Math.floor(Math.random() * 10).toString();

    this.serial = {
      seasons: [],
      seasonsCount: 0,
      imdbid: this.serieImdbid,
      title,
      slug: generatedSlug,
      releaseDate: isoDateString,
      releaseYear,
      endYear,
      totalEpisodes,
      portraitImage,
      voteCount,
      rating,
      description: description,
      fullDescription: fullDescription,
    };

    await this._parseSeasonsEpisodes();

    return this.serial;
  }

  private async _getSeasonsCount() {
    const seasonsResponse = await getSeasons({ serialImdb: this.serieImdbid });

    const seasons =
      seasonsResponse?.data?.title?.episodes?.displayableSeasons?.edges?.map(
        (season: any) => parseInt(season?.node?.season),
      );

    return seasons as number[];
  }

  private async _parseEpisode(edge: any): Promise<EpisodeData> {
    console.log(`parsing episode ${edge.node.id}...`);
    const episodeExtendData = (await getExtendDetails({ imdbid: edge.node.id }))
      ?.data?.title;

    // Add a delay to avoid hitting rate limits
    await sleep(500);

    const episodeRatingData = (await getRatings({ imdbid: edge.node.id }))?.data
      ?.title;

    const title = episodeExtendData?.titleText?.text;

    // Add a delay to avoid hitting rate limits
    await sleep(500);

    const generatedSlug =
      slugify(title, {
        replacement: '-',
        remove: undefined,
        lower: true,
        locale: 'en',
      }) +
      '-' +
      Math.floor(Math.random() * 10).toString() +
      Math.floor(Math.random() * 10).toString();

    const isoDateString = episodeExtendData?.releaseDate
      ? new Date(
          episodeExtendData?.releaseDate?.year,
          episodeExtendData?.releaseDate?.month - 1,
          episodeExtendData?.releaseDate?.day,
        )
          .toISOString()
          .split('T')[0]
      : null;

    const releaseYear = episodeExtendData?.releaseDate?.year ?? null;

    const episodeData: EpisodeData = {
      description: edge?.node?.plot?.plotText?.plainText,
      position: edge.position,
      imdbid: edge.node.id,
      title: title,
      portraitImage: episodeExtendData?.primaryImage?.url,
      runtime: episodeExtendData?.runtime?.seconds,
      releaseDate: isoDateString,
      releaseYear,
      slug: generatedSlug,
      rating: episodeRatingData?.ratingsSummary?.aggregateRating,
      voteCount: episodeRatingData?.ratingsSummary?.voteCount,
    };

    return episodeData;
  }

  private async _parseSeasonsEpisodes() {
    const seasonsPositions = await this._getSeasonsCount();
    this.serial.seasonsCount = seasonsPositions.length;

    if (!seasonsPositions.length) {
      throw new Error(`Serie ${this.serieImdbid} has no seasons`);
    }

    for (const seasonPosition of seasonsPositions) {
      const episodesResponse = await getSeasonEpisodes({
        serialImdbid: this.serieImdbid,
        season: seasonPosition,
      });

      // Add a delay to avoid hitting rate limits
      await sleep(500);

      const episodes: EpisodeData[] = [];
      const episodesEdges =
        episodesResponse.data?.title?.episodes?.episodes?.edges ?? [];

      for (const edge of episodesEdges) {
        const episodeData = await this._parseEpisode(edge);

        console.log(`S${seasonPosition}E${episodeData.position}`, episodeData);

        episodes.push(episodeData);
      }

      this.serial.seasons.push({
        episodes: episodes,
        position: seasonPosition,
        episodesCount: episodesEdges.length,
      });
    }
  }
}
