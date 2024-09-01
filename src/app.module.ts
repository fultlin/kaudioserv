import { Module } from '@nestjs/common';

import { ConfigModule } from './config.module';
import { UserModule } from '@entities/user/user.module';
import { TypeOrmModule } from '@db/typeorm.module';
import { MusicModule } from '@entities/music/music.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule,
    UserModule,
    MusicModule
  ],
})
export class AppModule {}
