export class Exoneration {
    private idExoneration: number;
    private nom: string;
    private status: number;

    constructor(idExoneration: number, nom: string, status: number) {
        this.idExoneration = idExoneration;
        this.nom = nom;
        this.status = status;
    }

    public getIdExoneration(): number {
        return this.idExoneration;
    }

    public setIdExoneration(value: number) {
        this.idExoneration = value;
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
