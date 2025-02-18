import { Body, Controller, Post, Put, HttpCode, HttpStatus, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../../service/auth/user.service';
import { RolesGuard } from '../../annotations/RolesGuard';
import { Role } from '../../annotations/Role.decorator';

/*
Role : 
1: Administrateur
2: Employé
*/

@Controller()
@UseGuards(RolesGuard)
@Role('1')
export class UtilisateurController {
    constructor(private utilisateurService: UserService) {}

    @HttpCode(HttpStatus.OK)
    @Post('utilisateur')
    signUp(@Body() signUpDto: Record<string, any>) {
      return this.utilisateurService.newUser(signUpDto.nom, signUpDto.prenom, signUpDto.adresse, signUpDto.contact, signUpDto.email, signUpDto.mdp, signUpDto.numeroMatricule, signUpDto.idDepartement, signUpDto.idRole, signUpDto.status);
    }

    @HttpCode(HttpStatus.OK)
    @Get('utilisateurs')
    allUsers(){
        return this.utilisateurService.getAllUsers();
    }

    @HttpCode(HttpStatus.OK)
    @Get('utilisateurs-awaiting')
    allUsersAwaiting(){
        return this.utilisateurService.getAllUsersAwaiting();
    }

    @HttpCode(HttpStatus.OK)
    @Put('utilisateur')
    validate(@Body() signUpDto: Record<string, any>){
        return this.utilisateurService.validateUser(signUpDto.idUser);
    }

    @HttpCode(HttpStatus.OK)
    @Put('utilisateur/password/:idUser')
    changeMdp(@Body() signUpDto: Record<string, any>, @Param('idUser') idUser: number){
        return this.utilisateurService.changePassword(signUpDto.password, idUser);
    }

    @HttpCode(HttpStatus.OK)
    @Put('utilisateur')
    escape(@Body() signUpDto: Record<string, any>){
        return this.utilisateurService.escapeUser(signUpDto.idUser);
    }

    @HttpCode(HttpStatus.OK)
    @Put('utilisateur/:idUser')
    delete(@Param('idUser') idUser: number){
        return this.utilisateurService.deleteUser(idUser);
    }

    @HttpCode(HttpStatus.OK)
    @Get('utilisateur/:idUser')
    getById(@Param('idUser') idUser: number) {
      return this.utilisateurService.getUserById(idUser);
    }
}
