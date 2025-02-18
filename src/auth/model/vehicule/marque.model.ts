export class Marque {
    private idMarque: number;
    private nom: string;
    private status: number;

    constructor(idMarque: number, nom: string, status: number) {
        this.idMarque = idMarque;
        this.nom = nom;
        this.status = status;
    }

    public getIdMarque(): number {
        return this.idMarque;
    }

    public setIdMarque(value: number) {
        this.idMarque = value;
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
