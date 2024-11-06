import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumEntity } from './album.entity';

@Controller('album')
export class AlbumController {
  @Inject(AlbumService)
  private albumService: AlbumService;

  @Post('/list/:current/:pageSize')
  async findList(
    @Param('current') current: number,
    @Param('pageSize') pageSize: number,
    @Body() brand: AlbumEntity,
  ) {
    return this.albumService.findList({ current, pageSize }, brand);
  }

  @Post('/add')
  create(@Body() body: any) {
    return this.albumService.add(body);
  }

  @Get('/:id')
  async getParaById(@Param('id') id: number) {
    return this.albumService.findById(id);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() para: AlbumEntity) {
    return this.albumService.update(id, para);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.albumService.remove(id);
  }

  @Get()
  async findAll() {
    return this.albumService.findAll();
  }
}
