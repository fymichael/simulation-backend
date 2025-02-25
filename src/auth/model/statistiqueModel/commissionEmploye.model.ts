import { User } from "../auth/user.model";

export class CommissionEmploye {
    constructor(
        private utilisateur: User,
        private montant: number,
    ) {}

    // Getter et Setter pour utilisateur
    getUtilisateur(): User {
        return this.utilisateur;
    }

    setUtilisateur(utilisateur: User): void {
        this.utilisateur = utilisateur;
    }

    // Getter et Setter pour montant
    getMontant(): number {
        return this.montant;
    }

    setMontant(montant: number): void {
        this.montant = montant;
    }
}
