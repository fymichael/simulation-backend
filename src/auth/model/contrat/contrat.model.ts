import { User } from "../auth/user.model";
import { Client } from "../client/client.model";
import { Vehicule } from "../vehicule/vehicule.model";
import { Classification } from "./classification.model";
import { Exoneration } from "./exoneration.model";
import { Garantie } from "./garantie.model";
import { ProcedurePaiement } from "./procedurePaiement.model";
import { TypePaiement } from "./typePaiement.model";

export class Contrat {
    private id_contrat: number;
    private numeroPolice: string;
    private client: Client;
    private vehicule: Vehicule;
    private dateDebut: Date;
    private duree: number;
    private dateEcheance: Date;
    private classification: Classification;
    private reduction: number;
    private montantTotal: number;
    private status: number;
    private exoneration: Exoneration;
    private utilisateur: User;
    private garanties: Array<Garantie>;
    private procedurePaiement: Array<ProcedurePaiement>;
    private renouvellement: Array<Date>;
    private typePaiement: TypePaiement;

    
    constructor(
        id_contrat: number,
        numeroPolice: string,
        client: Client,
        vehicule: Vehicule,
        dateDebut: Date,
        dureeContrat: number,
        dateEcheance: Date,
        classification: Classification,
        reduction: number,
        montantTotal: number,
        status: number,
        exoneration: Exoneration,
        utilisateur: User,
        garanties: Array<Garantie>,
        procedures: Array<ProcedurePaiement>,
        renouvellement: Array<Date>,
        typePaiement: TypePaiement
    ) {
        this.id_contrat = id_contrat;
        this.numeroPolice = numeroPolice;
        this.client = client;
        this.vehicule = vehicule;
        this.dateDebut = dateDebut;
        this.duree = dureeContrat;
        this.setDateEcheance(dateEcheance);
        this.classification = classification;
        this.reduction = reduction;
        this.montantTotal = montantTotal;
        this.status = status;
        this.exoneration = exoneration;
        this.utilisateur = utilisateur;
        this.garanties = garanties;
        this.procedurePaiement = procedures;
        this.renouvellement = renouvellement;
        this.typePaiement = typePaiement;
        
    }

    public getTypePaiement(): TypePaiement {
        return this.typePaiement;
    }

    public setTypePaiement(value: TypePaiement) {
        this.typePaiement = value;
    }

    // Getters
    getRenouvellement(): Array<Date> {
        return this.renouvellement;
    }

    getProcedurePaiement(): Array<ProcedurePaiement> {
        return this.procedurePaiement;
    }

    getGaranties(): Array<Garantie> {
        return this.garanties;
    }

    getIdContrat(): number {
        return this.id_contrat;
    }

    getNumeroPolice(): string {
        return this.numeroPolice;
    }

    getClient(): Client {
        return this.client;
    }

    getVehicule(): Vehicule {
        return this.vehicule;
    }

    getDateDebut(): Date {
        return this.dateDebut;
    }

    getDureeContrat(): number {
        return this.duree;
    }

    getDateEcheance(): Date {
        return this.dateEcheance;
    }

    getClassification(): Classification {
        return this.classification;
    }

    getReduction(): number {
        return this.reduction;
    }

    getMontantTotal(): number {
        return this.montantTotal;
    }

    getStatus(): number {
        return this.status;
    }

    getExoneration(): Exoneration {
        return this.exoneration;
    }

    getUtilisateur(): User {
        return this.utilisateur;
    }

    // Setters
    setRenouvellement(renouvellement: Array<Date>): void {
        this.renouvellement = renouvellement;
    }

    setProcedurePaiement(procedures: Array<ProcedurePaiement>): void {
        this.procedurePaiement = procedures;
    }

    setGaranties(garanties: Array<Garantie>): void {
        this.garanties = garanties;
    }

    setIdContrat(id_contrat: number): void {
        this.id_contrat = id_contrat;
    }

    setNumeroPolice(numero_police: string): void {
        this.numeroPolice = numero_police;
    }

    setClient(client: Client): void {
        this.client = client;
    }

    setVehicule(vehicule: Vehicule): void { 
        this.vehicule = vehicule;
    }

    setDateDebut(date_debut: Date): void {
        this.dateDebut = date_debut;
    }

    setDureeContrat(dureeContrat: number): void {
        this.duree = dureeContrat;
    }

    setDateEcheance(date_echeance: Date): void {
        this.dateEcheance = date_echeance;
    }

    setClassification(classification: Classification): void {
        this.classification = classification;
    }

    setReduction(reduction: number): void {
        this.reduction = reduction;
    }

    setMontantTotal(montant_total: number): void {
        this.montantTotal = montant_total;
    }

    setStatus(status: number): void {
        this.status = status;
    }

    setExoneration(exoneration: Exoneration): void {
        this.exoneration = exoneration;
    }

    setUtilisateur(utilisateur: User): void {
        this.utilisateur = utilisateur;
    }
}
