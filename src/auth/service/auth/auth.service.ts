
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ClientService } from '../client/client.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private clientService: ClientService,
        private jwtService: JwtService
    ) { }

    async signInClient(
        email: string,
        password: string,
    ): Promise<{ access_token: string, client: any }> {
        const client = await this.clientService.checkClientAuthentification(email, password);

        if (!client) {
            throw new UnauthorizedException();
        }

        const payload = { sub: client.getIdClient() };

        return {
            access_token: await this.jwtService.signAsync(payload),
            client: {
                id: client.getIdClient(),
                status: client.getStatus()
            },
        };
    }

    async signIn(
        email: string,
        password: string,
    ): Promise<{ access_token: string; user: any }> {
        const user = await this.usersService.checkAuthentification(email, password);

        if (!user) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.getIdUtilisateur(), username: user.getNom(), firstname: user.getPrenom(), departement: user.getDepartement().getNom(), prefixe_agence: user.getDepartement().getCode(), id_departement: user.getDepartement().getIdDepartement(), role: user.getRole().getIdRole(), photo: user.getPhoto()};

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.getIdUtilisateur(),
                username: user.getNom(),
                firstname: user.getPrenom(),
                departement: user.getDepartement().getNom(),
                role: user.getRole().getIdRole(),
                status: user.getStatus(),
            },
        };
    }
}
