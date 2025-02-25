export class Avenant {
    private idAvenant: number;
    private nom: string;
    private status: number;

    constructor(idAvenant: number, nom: string, status: number) {
        this.idAvenant = idAvenant;
        this.nom = nom;
        this.status = status;
    }

    public getIdAvenant(): number {
        return this.idAvenant;
    }

    public setIdAvenant(value: number) {
        this.idAvenant = value;
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
