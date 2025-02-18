
import { Body, Controller, Post, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { GenreService } from '../../service/client/genre.service';
import { Role } from '../../annotations/Role.decorator';
import { RolesGuard } from '../../annotations/RolesGuard';

@Controller()
@UseGuards(RolesGuard)
@Role('2')
export class GenreController {
  constructor(private genreService: GenreService) { }

  @HttpCode(HttpStatus.OK)
  @Get('genres')
  allGenres() {
    return this.genreService.getAllGenres();
  }
}
