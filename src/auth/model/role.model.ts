export class Role {
    private idRole: number;
    private nom: string;
    private status: number;

    constructor(idRole: number, nom: string, status: number) {
        this.idRole = idRole;
        this.nom = nom;
        this.status = status;
    }

    public getIdRole(): number {
        return this.idRole;
    }

    public setIdRole(value: number) {
        this.idRole = value;
    }

    public getNom(): string {
        return this.nom;
    }

    public setNom(value: string) {
        this.nom = value;
    }

    public getStatus(): number {
        return this.status;
    }

    public setStatus(value: number) {
        this.status = value;
    }
}
