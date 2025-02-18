import { Body, Controller, Post, HttpCode, HttpStatus, Get, Param, Put, UseGuards } from '@nestjs/common';
import { DepartementService } from '../../service/auth/departement.service';
import { RolesGuard } from '../../annotations/RolesGuard';
import { Role } from '../../annotations/Role.decorator';

@Controller()
@UseGuards(RolesGuard)
@Role('1')
export class DepartementController {
    constructor(private departementService: DepartementService) {}

    @HttpCode(HttpStatus.OK)
    @Get('departements')
    allDepartements(){
        return this.departementService.getAllDepartements();
    }

    @HttpCode(HttpStatus.OK)
    @Get('departement/:idDepartement')
    ByIdDepartement(@Param('idDepartement') idDepartement: number){
        return this.departementService.getDepartementById(idDepartement);
    }

    @HttpCode(HttpStatus.OK)
    @Put('departement/:idDepartement')
    delete(@Param('idDepartement') idDepartement: number){
        return this.departementService.deleteDepartement(idDepartement);
    }

    @HttpCode(HttpStatus.OK)
    @Post('departement')
    newDepartement(@Body() deptDto: Record<string, any>){
        return this.departementService.newDepartment(deptDto.nom, deptDto.nom_responsable, deptDto.contact_responsable, deptDto.localisation, deptDto.code);
    }

    @HttpCode(HttpStatus.OK)
    @Put('departement')
    updateDepartement(@Body() deptDto: Record<string, any>){
        return this.departementService.updateDepartment(deptDto.id_departement,deptDto.nom, deptDto.nom_responsable, deptDto.contact_responsable, deptDto.localisation, deptDto.code);
    }
}