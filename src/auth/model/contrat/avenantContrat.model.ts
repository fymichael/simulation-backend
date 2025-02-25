import { Avenant } from "./avenant.model";

export class AvenantContrat {
    private idAvenantContrat: number;
    private avenant: Avenant;
    private dateCreation: string;
    private status: number;

    constructor(idAvenantContrat: number, Avenant: Avenant, DateCreation: string, status: number) {
        this.idAvenantContrat = idAvenantContrat;
        this.avenant = Avenant;
        this.dateCreation = DateCreation;
        this.status = status;
    }

    public getIdAvenantContrat(): number {
        return this.idAvenantContrat;
    }

    public setIdAvenantContrat(idAvenantContrat: number) : void {
        this.idAvenantContrat = idAvenantContrat;
    }

    public getAvenant(): Avenant {
        return this.avenant;
    }

    public setAvenant(value: Avenant) {
        this.avenant = value;
    }

    public getDateCreation(): string {
        return this.dateCreation;
    }

    public setDateCreation(value: string) {
        this.dateCreation = value;
    }

    public getStatus(): number {
        return this.status;
    }

    public setStatus(value: number) {
        this.status = value;
    }
}
