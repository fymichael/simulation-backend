export class ProcedurePaiement {
    private idProcedurePaiement: number;
    private datePaiement: Date;
    private pourcentage: number;
    private status: number;

    constructor(idProcedurePaiement: number, datePaiement: Date, pourcentage: number,status: number) {
        this.idProcedurePaiement = idProcedurePaiement;
        this.datePaiement = datePaiement;
        this.pourcentage = pourcentage;
        this.status = status;
    }

    public getIdProcedurePaiement(): number {
        return this.idProcedurePaiement;
    }

    public setIdProcedurePaiement(value: number) {
        this.idProcedurePaiement = value;
    }

    public getDatePaiement(): Date {
        return this.datePaiement;
    }

    public setDatePaiement(value: Date) {
        this.datePaiement = value;
    }

    public getPourcentage(): number {
        return this.pourcentage;
    }

    public setPourcentage(value: number) {
        this.pourcentage = value;
    }

    public getStatus(): number {
        return this.status;
    }

    public setStatus(value: number) {
        this.status = value;
    }
}
