import { Module } from '@nestjs/common';
import { DvdModule } from './dvd/dvd.module';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    DvdModule,
   FileModule,
   AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
