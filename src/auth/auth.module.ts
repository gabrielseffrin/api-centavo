import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // <-- Faltando
import { JwtStrategy } from './jwt.strategy'; // <-- Faltando (ajuste o caminho se necessário)

@Module({
  imports: [
    PrismaModule,
    PassportModule, // <-- Adicione isto
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'senha-secreta',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // <-- Adicione JwtStrategy aqui
  exports: [AuthService], // <-- (opcional) caso use em outros módulos
})
export class AuthModule {}
