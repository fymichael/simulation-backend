import { Controller, Query, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { CsvService } from '../../service/csv/csv.service';

@Controller('csv')
export class CsvController {
    constructor(private readonly csvService: CsvService) { }

    @HttpCode(HttpStatus.OK)
    @Post('client')
    async insertClientData(@Body('fileName') fileName: string): Promise<any> {
      return this.csvService.insertClientData(fileName);
    }

    @HttpCode(HttpStatus.OK)
    @Post('vehicule')
    async vehiculeCsv(@Body('fileName') fileName: string): Promise<any[]> {
        return this.csvService.insertVehiculeData(fileName);
    }

    @HttpCode(HttpStatus.OK)
    @Post('contrat')
    async contratCsv(@Body('fileName') fileName: string): Promise<any[]> {
        return this.csvService.insertContratData(fileName);
    }
}
