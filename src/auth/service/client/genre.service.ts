/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/auth/service/database.service';
import { Genre } from '../../model/client/genre.model';

@Injectable()
export class GenreService {
    private genre: Genre | null = null;

    constructor(private readonly databaseService: DatabaseService) { }

    getGenre() {
        return this.genre;
    }

    setGenre(genre: Genre) {
        this.genre = genre;
    }

    async getAllGenres() {
        const query = 'SELECT * FROM genre where status != 0';
        return await this.databaseService.executeQuery(query);
    }

    async getGenreById(idGenre: number): Promise<Genre> {
        const query = 'SELECT * FROM genre where id_genre = '+idGenre;
        const result = await this.databaseService.executeQuery(query);

        if (result.length === 0) {
            throw new Error('Genre not found');
        }

        return new Genre(result[0].id_genre, result[0].nom, result[0].status, result[0].abreviation);
    }

    async newGenre(nom: string) {
        const query = 'insert into genre (nom) values (?)';
        return await this.databaseService.executeQuery(query, [nom]);
    }

    async updateGenre(idGenre: number, nom: string) {
        const query = 'update genre set nom = ? where id_genre = ?';
        return await this.databaseService.executeQuery(query, [nom, idGenre]);
    }

    async deleteGenre(idGenre: number) {
        const query = 'update genre set status = 0 where id_genre = ?';
        return await this.databaseService.executeQuery(query, [idGenre]);
    }
}
