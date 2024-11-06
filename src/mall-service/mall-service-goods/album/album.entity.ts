import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ibuy_album')
export class AlbumEntity {
  @PrimaryGeneratedColumn()
  id: number; //相册id

  @Column()
  name: string; //相册

  @Column({ nullable: true })
  image: string; //相册封面

  //[
  //  {
  //    "url": "http://localhost:9101/img/1.jpg",
  //    "uid": 1548143143154,
  //    "status": "success"
  //  },
  //  {
  //    "url": "http://localhost:9101/img/7.jpg",
  //    "uid": 1548143143155,
  //    "status": "success"
  //  }
  //]
  @Column({ name: 'image_items', nullable: true })
  imageItems: string; //相册列表

  @Column({ name: 'desc', nullable: true })
  desc: string; //相册描述
}
