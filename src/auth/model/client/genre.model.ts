export class Genre {
    private idGenre: number;
    private nom: string;
    private status: number;
    private abreviation: string;

    constructor(idGenre: number, nom: string, status: number, abreviation: string) {
        this.idGenre = idGenre;
        this.nom = nom;
        this.status = status;
        this.abreviation = abreviation;
    }

    public getAbreviation(): string {
        return this.abreviation;
    }

    public setAbreviation(abreviation: string): void {
        this.abreviation = abreviation;
    }

    public getIdGenre(): number {
        return this.idGenre;
    }

    public setIdGenre(value: number) {
        this.idGenre = value;
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
