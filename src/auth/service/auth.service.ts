
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }

    async signIn(
        email: string,
        password: string,
    ): Promise<{ access_token: string; user: any }> {
        const user = await this.usersService.checkAuthentification(email, password);

        if (!user) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.getIdUtilisateur(), username: user.getNom(), firstname: user.getPrenom(), departement: user.getDepartement().getNom(), role: user.getRole().getIdRole() };

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.getIdUtilisateur(),
                username: user.getNom(),
                firstname: user.getPrenom(),
                departement: user.getDepartement().getNom(),
                role: user.getRole().getNom(),
                status: user.getStatus(),
            },
        };
    }

}
