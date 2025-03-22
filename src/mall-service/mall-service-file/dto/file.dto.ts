import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FileUploadDto {
  @IsOptional()
  @IsString()
  path?: string;
}

export class FileDownloadDto {
  @IsNotEmpty()
  @IsString()
  bucketName: string;

  @IsNotEmpty()
  @IsString()
  objectName: string;

  @IsOptional()
  @IsString()
  path?: string;
}

export class FileDeleteDto {
  @IsNotEmpty()
  @IsString()
  bucketName: string;

  @IsNotEmpty()
  @IsString()
  objectName: string;

  @IsOptional()
  @IsString()
  path?: string;
}