import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { DataSource, FindOptionsWhere, In, Repository } from 'typeorm';
import { CollectionFiction } from './entities/collections-fictions.entity';
import { Fiction } from 'src/fictions/entities/fiction.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import slugify from 'slugify';
import { EditCollectionDto } from './dto/edit-collection.dto';
import { GetManyCollectionsParamsDto } from './dto/get-many-params.dto';
import { GetOneCollectionsParamsDto } from './dto/get-one-params.dto';
import * as deepEqual from 'fast-deep-equal';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,

    @InjectRepository(Fiction)
    private readonly fictionRepository: Repository<Fiction>,

    @InjectRepository(CollectionFiction)
    private readonly collectionFictionRepository: Repository<CollectionFiction>,

    private dataSource: DataSource,
  ) { }

  async createCollection(createCollectionDto: CreateCollectionDto) {
    const slug = this.slugifyCollection(createCollectionDto.name);

    const existingCollection = await this.collectionRepository.findOne({
      where: {
        slug: slug,
      },
    });

    if (existingCollection) {
      throw new BadRequestException(
        `Collection ${existingCollection.name} already exists`,
      );
    }

    const lastCollection = await this.getLastCollection();
    const nextPosition = lastCollection?.position
      ? lastCollection.position + 1
      : 1;

    const collectionData = this.collectionRepository.create({
      name: createCollectionDto.name,
      description: createCollectionDto.description,
      slug,
      position: nextPosition,
    });

    const collection = await this.collectionRepository.save(collectionData);

    if (createCollectionDto.fictions) {
      const collectionFictionsData: CollectionFiction[] = [];

      for (const [index, fictionId] of (
        createCollectionDto.fictions ?? []
      ).entries()) {
        const fiction = await this.fictionRepository.findOne({
          where: {
            id: fictionId,
          },
        });

        const collectionFictionData = this.collectionFictionRepository.create({
          collection,
          fiction,
          position: index + 1,
        });

        collectionFictionsData.push(collectionFictionData);
      }

      await this.collectionFictionRepository.save(collectionFictionsData);
    }

    return collection;
  }

  async editCollection(slug: string, editCollectionDto: EditCollectionDto) {
    const newSlug = editCollectionDto.name
      ? this.slugifyCollection(editCollectionDto.name)
      : slug;

    const existingCollection = await this.collectionRepository.findOne({
      where: {
        slug: slug,
      },
    });

    if (!existingCollection) {
      throw new NotFoundException(`Collection does not exist`);
    }

    if (newSlug !== slug) {
      const newSlugCollection = await this.collectionRepository.findOne({
        where: {
          slug: newSlug,
        },
      });

      if (newSlugCollection) {
        throw new BadRequestException(
          `Collection with name "${newSlugCollection.name}" already exists`,
        );
      }
    }

    await this.dataSource.transaction(async (manager) => {
      if (editCollectionDto.fictions) {
        // delete existing fictions in collection
        await manager.delete(CollectionFiction, {
          collection: {
            id: existingCollection.id,
          },
        });

        // Write new fictions inside the collection
        const collectionFictionsData: CollectionFiction[] = [];

        for (const [index, fictionId] of (
          editCollectionDto?.fictions ?? []
        ).entries()) {
          const fiction = await manager.findOne(Fiction, {
            where: {
              id: fictionId,
            },
          });

          const collectionFictionData = manager.create(CollectionFiction, {
            collection: existingCollection,
            fiction,
            position: index + 1,
          });

          collectionFictionsData.push(collectionFictionData);
        }

        await manager.save(CollectionFiction, collectionFictionsData);
      }

      // Update collection data
      await manager.update(
        Collection,
        {
          slug: slug,
        },
        {
          name: editCollectionDto.name,
          slug: newSlug,
          description: editCollectionDto.description,
        },
      );
    });

    return await this.collectionRepository.findOne({
      where: {
        slug: newSlug,
      },
    });
  }

  async getManyCollections(queryParams: GetManyCollectionsParamsDto) {
    const page = queryParams.page ?? 1;
    const limit = queryParams.limit ?? 10;

    const where: FindOptionsWhere<Collection> = {};

    const collections = await this.collectionRepository.find({
      where,
      skip: limit * (page - 1),
      take: limit,
      order: {
        position: 'ASC',
      },
    });

    for (const collection of collections) {
      const colFictions = await this.collectionFictionRepository.find({
        where: {
          collection: {
            slug: collection.slug,
          },
        },
        relations: {
          fiction: {
            studios: true,
            genres: true,
            movie: {
              audioTracks: true,
              subtitleTracks: true,
            },
            serial: true,
          },
        },
        take: 12,
        order: {
          position: 'ASC',
        },
      });

      collection.collectionFictions = colFictions;
    }

    const total = await this.collectionRepository.count({
      where,
    });

    return {
      collections,
      total,
    };
  }

  async getOneCollection(
    slug: string,
    queryParams: GetOneCollectionsParamsDto,
  ) {
    const page = queryParams.page ?? 1;
    const limit = queryParams.limit ?? 10;

    const where: FindOptionsWhere<Collection> = {
      slug,
    };

    const collection = await this.collectionRepository.findOne({
      where,
    });
    if (!collection) throw new NotFoundException('Collection not found');

    const collectionFictions = await this.collectionFictionRepository.find({
      where: {
        collection: where,
      },
      order: {
        position: 'ASC',
      },
      skip: limit * (page - 1),
      take: limit,
      relations: {
        fiction: {
          studios: true,
          genres: true,
          movie: {
            audioTracks: true,
            subtitleTracks: true,
          },
          serial: true,
        },
      },
    });

    collection.collectionFictions = collectionFictions;

    const total = await this.collectionFictionRepository.count({
      where: {
        collection: where,
      },
    });

    return { collection, total };
  }

  async deleteCollection(slug: string) {
    const collectionExists = await this.collectionRepository.exists({
      where: {
        slug,
      },
    });

    if (!collectionExists) throw new NotFoundException('Collection not found');

    await this.collectionRepository.delete({
      slug,
    });
  }

  async getCollectionsByFictionId(fictionId: string) {
    return await this.collectionFictionRepository.find({
      where: {
        fiction: [
          {
            movieImdbid: fictionId,
          },
          {
            serialImdbid: fictionId,
          },
        ],
      },
      relations: {
        collection: true,
      },
    });
  }

  async reorderCollections(collectionsIds: string[]): Promise<Collection[]> {
    const collections = await this.collectionRepository.find();

    // Check if all collections ids are passed
    if (
      !deepEqual(
        [...collections].map((c) => c.id).sort(),
        [...collectionsIds].sort(),
      )
    ) {
      throw new BadRequestException(
        'All collections should be passed to change the order',
      );
    }

    await this.dataSource.transaction(async (manager) => {
      // Step 1: Set all positions to negative values to avoid conflicts
      for (const [index, collectionId] of collectionsIds.entries()) {
        await manager.update(
          Collection,
          { id: collectionId },
          { position: -(index + 1) }, // Use negative positions to avoid conflicts
        );
      }

      // Step 2: Update positions to the new values
      for (const [index, collectionId] of collectionsIds.entries()) {
        await manager.update(
          Collection,
          { id: collectionId },
          { position: index + 1 },
        );
      }
    });

    const reorderedCollections = await this.collectionRepository.find({
      order: {
        position: 'ASC', // Order by ascending position to reflect the new order
      },
    });

    return reorderedCollections;
  }

  private async getLastCollection(): Promise<Maybe<Collection>> {
    const collections = await this.collectionRepository.find({
      order: {
        position: 'DESC',
      },
      take: 1,
    });

    return collections[0];
  }

  private async getLastCollectionFiction(
    slug: string,
  ): Promise<Maybe<CollectionFiction>> {
    const collectionFictions = await this.collectionFictionRepository.find({
      where: {
        collection: {
          slug,
        },
      },
      order: {
        position: 'DESC',
      },
    });

    return collectionFictions[0];
  }

  private slugifyCollection(name: string) {
    return slugify(name, {
      replacement: '-',
      remove: undefined,
      lower: true,
      locale: 'en',
    });
  }
}
