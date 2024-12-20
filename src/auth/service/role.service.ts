/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Role } from '../model/role.model';
import { DatabaseService } from 'src/auth/service/database.service';

@Injectable()
export class RoleService {
    private role: Role | null = null;

    constructor(private readonly databaseService: DatabaseService) { }

    getRole() {
        return this.role;
    }

    setRole(role: Role) {
        this.role = role;
    }

    async getAllRoles() {
        const query = 'SELECT * FROM role where status != 0';
        return await this.databaseService.executeQuery(query);
    }

    async getRoleById(idRole: number): Promise<Role> {
        const query = 'SELECT * FROM role where id_role = '+idRole;
        const result = await this.databaseService.executeQuery(query);

        if (result.length === 0) {
            throw new Error('Role not found');
        }

        return new Role(result[0].id_role, result[0].nom, result[0].status);
    }

    async newRole(nom: string) {
        const query = 'insert into role (nom) values (?)';
        return await this.databaseService.executeQuery(query, [nom]);
    }

    async updateRole(idRole: number, nom: string) {
        const query = 'update role set nom = ? where id_role = ?';
        return await this.databaseService.executeQuery(query, [nom, idRole]);
    }

    async deleteRole(idRole: number) {
        const query = 'update role set status = 0 where id_role = ?';
        return await this.databaseService.executeQuery(query, [idRole]);
    }
}
