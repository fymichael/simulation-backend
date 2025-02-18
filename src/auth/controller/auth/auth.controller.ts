
import { Body, Controller, Post, HttpCode, HttpStatus, Put, Param } from '@nestjs/common';
import { AuthService } from '../../service/auth/auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.mdp);
  }

  @HttpCode(HttpStatus.OK)
  @Post('loginClient')
  signInClient(@Body() signInDto: Record<string, any>) {
    return this.authService.signInClient(signInDto.email, signInDto.mdp);
  }
}
