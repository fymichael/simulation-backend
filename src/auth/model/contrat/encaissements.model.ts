import { ProcedurePaiement } from "./procedurePaiement.model";
import { TypePaiement } from "./typePaiement.model";

export class Encaissement {
    constructor(
        private idEncaissement: number,
        private procedurePaiement: ProcedurePaiement,
        private dateEncaissement: Date,
        private montant: number,
        private status: number,
        private numeroPiece: string,
    ) {}

    public getNumeroPiece(): string {
        return this.numeroPiece;
    }

    public setNumeroPiece(value: string) {
        this.numeroPiece = value;
    }

    public getIdEncaissement(): number {
        return this.idEncaissement;
    }

    public setIdEncaissement(value: number) {
        this.idEncaissement = value;
    }

    public getProcedurePaiement(): ProcedurePaiement {
        return this.procedurePaiement;
    }

    public setProcedurePaiement(value: ProcedurePaiement) {
        this.procedurePaiement = value;
    }

    public getDateEncaissement(): Date {
        return this.dateEncaissement;
    }

    public setDateEncaissement(value: Date) {
        this.dateEncaissement = value;
    }

    public getMontant(): number {
        return this.montant;
    }

    public setMontant(value: number) {
        this.montant = value;
    }

    public getStatus(): number {
        return this.status;
    }

    public setStatus(value: number) {
        this.status = value;
    }
}
