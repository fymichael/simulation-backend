export class SuiviPaiement {
    constructor(
        private numero_police: string,
        private montant: number,
        private date: Date,
        private status: number
    ) {}

    // Getter et Setter pour numero_police
    public getNumeroPolice(): string {
        return this.numero_police;
    }

    public setNumeroPolice(numero_police: string): void {
        this.numero_police = numero_police;
    }

    // Getter et Setter pour montant
    public getMontant(): number {
        return this.montant;
    }

    public setMontant(montant: number): void {
        this.montant = montant;
    }

    // Getter et Setter pour date_paiement
    public getDatePaiement(): Date {
        return this.date;
    }

    public setDatePaiement(date: Date): void {
        this.date = date;
    }

    // Getter et Setter pour status
    public getStatus(): number {
        return this.status;
    }

    public setStatus(status: number): void {
        this.status = status;
    }
}
