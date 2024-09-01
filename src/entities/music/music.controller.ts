import {
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { MusicService } from './music.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const result = await this.musicService.uploadMusic(file, req.body);

      return res.status(201).json({
        message: 'File uploaded successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).json({
        message: 'An error occurred while uploading the file',
        error: error.message,
      });
    }
  }

  @Get('/stream/:filename')
  streamFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '../../uploads', filename)
    res.sendFile(filePath)
  }

  @Get('/:track')
  async getTrack(@Param('track') track: string, @Res() res: Response) {
    const tracks = await this.musicService.findMusic(track)

    return res.send({'traks': tracks})
  }
}
