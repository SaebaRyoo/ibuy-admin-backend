import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { FileUploadDto, FileDownloadDto, FileDeleteDto } from './dto/file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any, @Query() query: FileUploadDto) {
    return await this.fileService.uploadFile(
      'mall',
      file.originalname,
      file.buffer,
      query.path,
    );
  }

  // @Get('/read')
  // readFile(
  //   @Body() body: { bucketName: string; objectName: string; path: string },
  // ) {
  //   return this.fileService.readFile(
  //     body.bucketName,
  //     body.objectName,
  //     body.path,
  //   );
  // }

  @Get('/download')
  readFileStream(@Query() query: FileDownloadDto) {
    return this.fileService.readFileStream(
      query.bucketName,
      query.objectName,
      query.path,
    );
  }

  @Delete('/delete')
  deleteFile(@Query() query: FileDeleteDto) {
    return this.fileService.deleteFile(
      query.bucketName,
      query.objectName,
      query.path,
    );
  }

  @Get('/list')
  getDirectoryStructure() {
    return this.fileService.getDirectoryStructure('mall');
  }
}
