export class Classification {
    private idClassification: number;
    private nom: string;
    private code: number;
    private status: number;

    constructor(idClassification: number, nom: string, code: number,status: number) {
        this.idClassification = idClassification;
        this.nom = nom;
        this.code = code;
        this.status = status;
    }

    public getIdClassification(): number {
        return this.idClassification;
    }

    public setIdClassification(value: number) {
        this.idClassification = value;
    }

    public getNom(): string {
        return this.nom;
    }

    public setNom(value: string) {
        this.nom = value;
    }

    public getCode(): number {
        return this.code;
    }

    public setCode(value: number) {
        this.code = value;
    }

    public getStatus(): number {
        return this.status;
    }

    public setStatus(value: number) {
        this.status = value;
    }
}
