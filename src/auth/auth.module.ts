import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service'; // Import your PrismaService
import { jwtConstants } from './constant/constants';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local/local.strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';



@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret, // Use a strong secret key here
      signOptions: { expiresIn: '2h' }, // Adjust token expiration time as needed
    }),
  ],
  controllers:[AuthController],
  providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}