export class Garantie {
    private idGarantie: number;
    private nom: string;
    private status: number;

    constructor(idGarantie: number, nom: string, status: number) {
        this.idGarantie = idGarantie;
        this.nom = nom;
        this.status = status;
    }

    public getIdGarantie(): number {
        return this.idGarantie;
    }

    public setIdGarantie(value: number) {
        this.idGarantie = value;
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
