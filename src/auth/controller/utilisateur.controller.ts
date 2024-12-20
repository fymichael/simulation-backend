import { Body, Controller, Post, Put, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { UserService } from '../service/user.service';

@Controller()
export class UtilisateurController {
    constructor(private utilisateurService: UserService) {}

    @HttpCode(HttpStatus.OK)
    @Get('utilisateurs')
    allUsers(){
        return this.utilisateurService.getAllUsers();
    }

    @HttpCode(HttpStatus.OK)
    @Put('utilisateur')
    validate(@Body() signUpDto: Record<string, any>){
        return this.utilisateurService.validateUser(signUpDto.idUser);
    }

    @HttpCode(HttpStatus.OK)
    @Put('utilisateur')
    escape(@Body() signUpDto: Record<string, any>){
        return this.utilisateurService.escapeUser(signUpDto.idUser);
    }

    @HttpCode(HttpStatus.OK)
    @Get('utilisateur')
    getById(@Body() signUpDto: Record<string, any>){
        return this.utilisateurService.getUserById(signUpDto.idUser);
    }
}
