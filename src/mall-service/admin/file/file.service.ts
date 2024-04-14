import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class FileService {
  private readonly minioClient: Minio.Client;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'admin',
      secretKey: 'admin123',
    });
  }

  async uploadFile(
    bucketName: string,
    objectName: string,
    data: Buffer,
    path: string = '/',
  ): Promise<Record<string, string>> {
    await this.minioClient.putObject(bucketName, `${path}/${objectName}`, data);
    return {
      bucketName,
      path,
      objectName,
    };
  }

  async downloadFile(
    bucketName: string,
    objectName: string,
    path: string,
  ): Promise<void> {
    await this.minioClient.getObject(bucketName, `${path}/${objectName}`);
  }

  async deleteFile(
    bucketName: string,
    objectName: string,
    path: string,
  ): Promise<void> {
    await this.minioClient.removeObject(bucketName, `${path}/${objectName}`);
  }
}
