import { Body, Controller, Post, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { DepartementService } from '../service/departement.service';

@Controller()
export class DepartementController {
    constructor(private departementService: DepartementService) {}

    @HttpCode(HttpStatus.OK)
    @Get('departements')
    allDepartements(){
        return this.departementService.getAllDepartements();
    }
}