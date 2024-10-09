import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/query')
  async search(@Query() searchMap) {
    const result = await this.searchService.search(searchMap);
    return Object.fromEntries(result);
  }

  @Get('/import')
  async importData() {
    return this.searchService.importSku();
  }
}
