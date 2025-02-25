export class Commission {
    private idCommission: number;
    private nom: string;
    private taux: number;
    private status: number;

    constructor(idCommission: number, nom: string, taux: number, status: number) {
        this.idCommission = idCommission;
        this.nom = nom;
        this.taux = taux;
        this.status = status;
    }

    public getTaux(): number{
        return this.taux;
    }

    public setTaux(taux: number) {
        this.taux = taux;
    } 

    public getIdCommission(): number {
        return this.idCommission;
    }

    public setIdCommission(value: number) {
        this.idCommission = value;
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
