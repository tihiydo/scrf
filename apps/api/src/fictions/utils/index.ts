import { FindOptionsWhere } from 'typeorm';
import { Fiction, FictionKind } from '../entities/fiction.entity';
import { BadRequestException } from '@nestjs/common';

export function getKindWhere(kind: FictionKind, imdbid: string) {
  const where: FindOptionsWhere<Fiction> = {
    kind: kind,
  };

  if (kind === 'serial') {
    where.serialImdbid = imdbid;
  }

  if (kind === 'movie') {
    where.movieImdbid = imdbid;
  }

  return where;
}

export function parseFictionKind(kind: string): FictionKind {
  const isFictionKind = Object.values(FictionKind).includes(
    kind as FictionKind,
  );

  if (!isFictionKind) {
    throw new BadRequestException('Invalid fiction kind');
  }

  return kind as FictionKind;
}
