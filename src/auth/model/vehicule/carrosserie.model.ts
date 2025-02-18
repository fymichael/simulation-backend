export class Carrosserie {
    private idCarrosserie: number;
    private nom: string;
    private status: number;

    constructor(idCarrosserie: number, nom: string, status: number) {
        this.idCarrosserie = idCarrosserie;
        this.nom = nom;
        this.status = status;
    }

    public getIdCarrosserie(): number {
        return this.idCarrosserie;
    }

    public setIdCarrosserie(value: number) {
        this.idCarrosserie = value;
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
