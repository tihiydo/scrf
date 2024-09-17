import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as mkdirp from 'mkdirp';
import { extname, join } from 'path';
import { Request } from 'express';
import { UploadDto, UploadDtoSchema } from './dto/upload.dto';
import { Roles } from 'decorators/roles.decorator';

@Controller('upload')
export class UploadController {
  @Post()
  @Roles(['User', 'Admin'])
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const body = UploadDtoSchema.safeParse(req.body).data;

          const uploadPath = `./uploads/${body.collection ?? ''}/${body.path?.split(',')?.join('/') ?? ''}`;
          // Create directory if it doesn't exist
          mkdirp.sync(uploadPath);
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now();
          const fileExt = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${fileExt}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        const bodyParse = UploadDtoSchema.safeParse(req.body);

        if (!bodyParse.success) {
          return cb(
            new BadRequestException(bodyParse.error.errors[0].message),
            false,
          );
        }
        const body = bodyParse.data;

        if (
          body.allowed &&
          !body.allowed
            ?.split(',')
            ?.some((ext) => file.originalname.endsWith(ext))
        ) {
          return cb(new BadRequestException('File not allowed'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 50_000_000,
      },
    }),
  )
  uploadFile(
    @Req() req: Request,
    @Body() uploadDto: UploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filePath = join(
      'uploads',
      uploadDto.collection,
      uploadDto.path?.split(',')?.join('/') ?? '',
      file.filename,
    ).replace(/\\/g, '/');
        //d
    return {
      filename: file.filename,
      path: filePath,
      url: `${req.protocol}://${req.get('host')}/api/${filePath}`,
    };
  }
}
