import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Music } from './music.entity';
import { extname, join } from 'path';
import * as fs from 'fs';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music)
    private readonly musicRepository: Repository<Music>,
  ) {}

  async uploadMusic(file: any, musicData: any) {
    const uploadDir = join(__dirname, '../../uploads');

    const fileExtension = extname(file.originalname)

    const filename = `${musicData.name}${fileExtension}`;
    const filePath = join(uploadDir, filename);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    console.log('File buffer:', file.buffer);
    console.log('Saving file to:', filePath);

    fs.writeFileSync(filePath, file.buffer);

    const newMusic = this.musicRepository.create({
      ...musicData,
      name: filename,
      path: filePath,
    });

    return await this.musicRepository.save(newMusic);
  }

  async findMusic(track: string) {
    const data = this.musicRepository.find({
      where: [
        {name: `${track}.mp3`},
        {author: track}
      ]
    })

    return data
  }
}
