import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Roles } from 'decorators/roles.decorator';
import { GetManyCollectionsParamsDto } from './dto/get-many-params.dto';
import { GetOneCollectionsParamsDto as GetOneCollectionParamsDto } from './dto/get-one-params.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { EditCollectionDto } from './dto/edit-collection.dto';
import { CollectionsService } from './collections.service';
import { EditCollectionsDto } from './dto/edit-collections.dto';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionService: CollectionsService) { }

  @Get('/')
  async getManyCollections(@Query() queryParams: GetManyCollectionsParamsDto) {
    const collections =
      await this.collectionService.getManyCollections(queryParams);

    return collections;
  }

  @Get('/:slug')
  async getOneCollection(
    @Param('slug') slug: string,
    @Query() queryParams: GetOneCollectionParamsDto,
  ) {
    const result = await this.collectionService.getOneCollection(
      slug,
      queryParams,
    );

    return result;
  }

  @Post('/')
  @Roles([UserRole.Admin, UserRole.ContentManager])
  async createCollection(@Body() body: CreateCollectionDto) {
    const newCollection = await this.collectionService.createCollection(body);

    return newCollection;
  }

  @Put('/')
  @Roles([UserRole.Admin, UserRole.ContentManager])
  async editCollections(@Body() body: EditCollectionsDto) {
    const newCollection = await this.collectionService.reorderCollections(
      body.collections,
    );

    return newCollection;
  }

  @Put('/:slug')
  @Roles([UserRole.Admin, UserRole.ContentManager])
  async editCollection(
    @Param('slug') slug: string,
    @Body() body: EditCollectionDto,
  ) {
    const editedCollection = await this.collectionService.editCollection(
      slug,
      body,
    );

    return editedCollection;
  }

  @Delete('/:slug')
  @Roles([UserRole.Admin, UserRole.ContentManager])
  async removeCollection(@Param('slug') slug: string) {
    await this.collectionService.deleteCollection(slug);
  }

  @Get('fiction/:id')
  async getCollections(@Param('id') id: string) {
    const collections = await this.collectionService.getCollectionsByFictionId(id);
    return collections;
  }
}
