export class Energie {
    private idEnergie: number;
    private nom: string;
    private status: number;

    constructor(idEnergie: number, nom: string, status: number) {
        this.idEnergie = idEnergie;
        this.nom = nom;
        this.status = status;
    }

    public getIdEnergie(): number {
        return this.idEnergie;
    }

    public setIdEnergie(value: number) {
        this.idEnergie = value;
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
