export class Comparaison {
    constructor(
        private numeroPolice: string,
        private montant: number
    ) {}

    public getNumeroPolice(): string {
        return this.numeroPolice;
    }

    public setNumeroPolice(value: string) {
        this.numeroPolice = value;
    }

    public getMontant(): number {
        return this.montant;
    }

    public setMontant(value: number) {
        this.montant = value;
    }
}
