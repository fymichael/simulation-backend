import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { User } from '../../model/auth/user.model';
import { RoleService } from './role.service';
import { DepartementService } from './departement.service';

@Injectable()
export class UserService {
    private currentUser: User | null = null;
    private roleService: RoleService;
    private departementService: DepartementService;

    constructor(
        private readonly databaseService: DatabaseService,
        roleService: RoleService,
        departementService: DepartementService
    ) {
        this.roleService = roleService;
        this.departementService = departementService;
    }

    setUser(user: User) {
        this.currentUser = user;
    }

    getUser() {
        return this.currentUser;
    }

    async changePassword(newMdp: string,idUser: number): Promise<void> {
        const query = `UPDATE utilisateur SET mdp = '${newMdp}' WHERE id_utilisateur = ` + idUser;
        await this.databaseService.executeQuery(query);
    }

    async validateUser(idUser: number): Promise<void> {
        const query = 'UPDATE utilisateur SET status = 5 WHERE id_utilisateur = ' + idUser;
        await this.databaseService.executeQuery(query);
    }

    async escapeUser(idUser: number): Promise<void> {
        const query = 'UPDATE utilisateur SET status = 3 WHERE id_utilisateur = ' + idUser;
        await this.databaseService.executeQuery(query);
    }

    async getAllUsersAwaiting(): Promise<Array<User>> {
        const query = 'SELECT * FROM utilisateur where status = 1';
        const result = await this.databaseService.executeQuery(query);
        let users = Array<User>();
        if (result.length === 0) {
            throw new Error("Pas de departement recuperer");
        }
        else {
            for (let i = 0; i < result.length; i++) {
                const userDepartement = await this.departementService.getDepartementById(result[i].id_departement)
                const userRole = await this.roleService.getRoleById(result[i].id_role);
                const userInfo = new User(result[i].id_utilisateur, result[i].nom, result[i].prenom, result[i].adresse, result[i].contact, result[i].email, result[i].mdp, result[i].numero_matricule, userDepartement, userRole, result[i].status, result[i].photo)
                users.push(userInfo)
            }
            return users;
        }
    }

    async getAllUsers(): Promise<Array<User>> {
        const query = 'SELECT * FROM utilisateur where status > 1 and status != 3';
        const result = await this.databaseService.executeQuery(query);
        let users = Array<User>();
        if (result.length === 0) {
            throw new Error("Pas de departement recuperer");
        }
        else {
            for (let i = 0; i < result.length; i++) {
                const userDepartement = await this.departementService.getDepartementById(result[i].id_departement)
                const userRole = await this.roleService.getRoleById(result[i].id_role);
                const userInfo = new User(result[i].id_utilisateur, result[i].nom, result[i].prenom, result[i].adresse, result[i].contact, result[i].email, result[i].mdp, result[i].numero_matricule, userDepartement, userRole, result[i].status, result[i].photo)
                users.push(userInfo)
            }
            return users;
        }
    }

    async getUserById(idUser: number) {
        const query = 'SELECT * FROM utilisateur where id_utilisateur = ' + idUser;
        const result = await this.databaseService.executeQuery(query);
        
        const roleUser = await this.roleService.getRoleById(result[0].id_role);
        const departementUser = await this.departementService.getDepartementById(result[0].id_departement);
        
        const user = new User(
            result[0].id_utilisateur,
            result[0].nom,
            result[0].prenom,
            result[0].adresse,
            result[0].contact,
            result[0].email,
            result[0].mdp,
            result[0].numero_matricule,
            departementUser,
            roleUser,
            result[0].status,
            result[0].photo
            );
            
            this.setUser(user);
            
        return this.getUser();
    }

    async updateUser(idUser: number, nom: string, prenom: string, adresse: string, contact: string): Promise<void> {
        const query = 'UPDATE utilisateur SET nom = ?, prenom = ?, adresse = ?, contact = ? WHERE id_utilisateur = ?';
        await this.databaseService.executeQuery(query, [nom, prenom, adresse, contact, idUser]);
    }

    async deleteUser(idUser: number) {
        const query = 'UPDATE utilisateur set status = 0 WHERE id_utilisateur = ' + idUser;
        return this.databaseService.executeQuery(query);
    }

    async exist(email: string, mdp: string): Promise<boolean> {
        const query = 'SELECT * FROM utilisateur WHERE email = ? AND mdp = ?';
        const result = await this.databaseService.executeQuery(query, [email, mdp]);
        return result.length > 0;
    }

    async newUser(nom: string, prenom: string, adresse: string, contact: string, email: string, mdp: string, numeroMatricule: string, idDepartement: number, idRole: number, status: number) {
        const query = `INSERT INTO utilisateur (nom, prenom, adresse, contact, email, mdp, numero_matricule, id_departement, id_role, status) 
                       VALUES ('${nom}', '${prenom}', '${adresse}', '${contact}', '${email}', '${mdp}', '${numeroMatricule}', ${idDepartement}, ${idRole}, ${status})`;
        console.log(query);
        await this.databaseService.executeQuery(query);
    }


    async checkAuthentification(email: string, mdp: string) {
        if (!email || email.trim() === "") {
            throw new Error("Email non valide ou null");
        }

        if (!mdp || mdp.trim() === "") {
            throw new Error("Mot de passe invalide ou null");
        }

        const query = `SELECT * FROM utilisateur WHERE email = '${email}' AND mdp = '${mdp}'`;

        console.log(query);

        const result = await this.databaseService.executeQuery(query);

        if (result.length === 0) {
            throw new UnauthorizedException();
        }

        const roleUser = await this.roleService.getRoleById(result[0].id_role);
        const departementUser = await this.departementService.getDepartementById(result[0].id_departement);

        const user = new User(
            result[0].id_utilisateur,
            result[0].nom,
            result[0].prenom,
            result[0].adresse,
            result[0].contact,
            result[0].email,
            result[0].mdp,
            result[0].numero_matricule,
            departementUser,
            roleUser,
            result[0].status,
            result[0].photo
        );

        this.setUser(user);

        return this.getUser();
    }
}
