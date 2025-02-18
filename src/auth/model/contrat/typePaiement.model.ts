export class TypePaiement {
    private idTypePaiement: number;
    private nom: string;
    private status: number;

    constructor(idTypePaiement: number, nom: string, status: number) {
        this.idTypePaiement = idTypePaiement;
        this.nom = nom;
        this.status = status;
    }

    public getIdTypePaiement(): number {
        return this.idTypePaiement;
    }

    public setIdTypePaiement(value: number) {
        this.idTypePaiement = value;
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
