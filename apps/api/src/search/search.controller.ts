import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryParams } from './types';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query() query: SearchQueryParams) {
    const searchStr = query.searchStr;
    const entities = query.entities?.split(',');

    if (searchStr.length < 3)
      return {
        studios: [],
        personalities: [],
        movies: [],
        serials: [],
        fictions: [],
      };

    const searchResult = await this.searchService.searchAll(
      searchStr,
      entities,
    );

    return searchResult;
  }
}
