import { Contrat } from "../contrat/contrat.model";

export class DemandeClient {
    private idDemandeClient: number;
    private dateEnvoie: Date;
    private titre: string;
    private objet: string;
    private status: number;
    private contrat: Contrat;
    private isRenouvellement: number;

    constructor(idDemandeClient: number, dateEnvoie: Date, titre: string, objet: string, status: number, contrat: Contrat, isRenouvellement: number) {
        this.idDemandeClient = idDemandeClient;
        this.dateEnvoie = dateEnvoie;
        this.titre = titre;
        this.objet = objet;
        this.contrat = contrat;
        this.status = status;
        this.isRenouvellement = isRenouvellement;
    }

    // Getters
    public getContrat(): Contrat {
        return this.contrat;
    }

    public getIsRenouvellement(): number {
        return this.isRenouvellement;
    }

    public getIdDemandeClient(): number {
        return this.idDemandeClient;
    }

    public getDateEnvoie(): Date {
        return this.dateEnvoie;
    }

    public getTitre(): string {
        return this.titre;
    }

    public getObjet(): string {
        return this.objet;
    }

    public getStatus(): number {
        return this.status;
    }

    // Setters
    public setContrat(Contrat: Contrat): void {
        this.contrat = Contrat;
    }

    public setIsRenouvellement(IsRenouvellement: number): void {
        this.isRenouvellement = IsRenouvellement;
    }

    public setIdDemandeClient(idDemandeClient: number): void {
        this.idDemandeClient = idDemandeClient;
    }

    public setDateEnvoie(dateEnvoie: Date): void {
        this.dateEnvoie = dateEnvoie;
    }

    public setTitre(titre: string): void {
        this.titre = titre;
    }

    public setObjet(objet: string): void {
        this.objet = objet;
    }

    public setStatus(status: number): void {
        this.status = status;
    }
}
