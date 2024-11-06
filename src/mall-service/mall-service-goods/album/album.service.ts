import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Result from '../../../common/utils/Result';
import findWithConditions from '../../../common/utils/findWithConditions';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
  ) {}

  /**
   * 查询所有
   */
  async findAll() {
    const data = await this.albumRepository.find();
    return new Result(data);
  }

  /**
   * 分页 + 条件查询
   * @param pageParma
   * @param conditions
   */
  async findList(pageParma: any, conditions) {
    const [data, total] = await findWithConditions(
      this.albumRepository,
      conditions,
      pageParma,
      'album',
    );
    return new Result({ data, total });
  }

  async findById(id: number) {
    const data = await this.albumRepository.findOneBy({ id });
    return new Result(data);
  }

  async add(album: AlbumEntity) {
    const data = await this.albumRepository.insert(album);
    return new Result(data);
  }

  async update(id: number, album: AlbumEntity) {
    const data = await this.albumRepository.update(id, album);

    return new Result(data);
  }

  async remove(id: number) {
    await this.albumRepository.delete(id);
    return new Result(null);
  }
}
