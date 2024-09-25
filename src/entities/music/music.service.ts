import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Music } from './music.entity';
import path, { extname, join, resolve } from 'path';
import * as fs from 'fs';
import { env } from 'process';

const EasyYandexS3 = require('easy-yandex-s3').default;

const s3 = new EasyYandexS3({
  auth: {
    accessKeyId: env.ACCESSKEYID,
    secretAccessKey: env.SECRETACCESSKEY,
  },
  Bucket: 'id-kaudio',
  debug: true,
});

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
  ) {}

  async uploadMusic(file: any, musicData: any) {
    const uploadDir = join(__dirname, '../../uploads');

    const fileExtension = extname(file.originalname);

    const filename = `${musicData.name}${fileExtension}`;
    const filePath = join(uploadDir, filename);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);

    try {
      const res = await s3.Upload(
        {
          path: filePath,
          name: filename,
        },
        '/music/',
      );

      const newMusic = this.musicRepository.create({
        ...musicData,
        name: filename,
        path: res.Location,
      });

      console.log(res.Location);
      return await this.musicRepository.save(newMusic);
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      throw new Error('Ошибка при загрузке файла');
    }
  }

  async findMusic(track: string) {
    const data = await this.musicRepository.find({
      where: [{ name: `${track}.mp3` }, { author: track }],
    });
    return data;
  }

  async downloadTrack(track: string) {
    console.log('зашли');
    const downloadDir = join(__dirname, '../../download');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
    s3.Download(`music/${track}`, `${downloadDir}/${track}`);
  }
}
