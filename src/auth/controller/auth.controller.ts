
import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.mdp);
  }

  @HttpCode(HttpStatus.OK)
  @Post('inscription')
  signUp(@Body() signUpDto: Record<string, any>) {
    return this.userService.newUser(signUpDto.nom, signUpDto.prenom, signUpDto.adresse, signUpDto.contact, signUpDto.email, signUpDto.mdp, signUpDto.numeroMatricule, signUpDto.idDepartement, signUpDto.idRole, signUpDto.status);
  }
}
