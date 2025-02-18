import { Contrat } from "../contrat/contrat.model";
import { Genre } from "./genre.model";

export class Client {
    private idClient: number;
    private nom: string;
    private prenom: string;
    private date_naissance: Date;
    private adresse: string;
    private contact: string;
    private email: string;
    private mdp: string;
    private cin: string;
    private genre: Genre;
    private status: number;

    constructor(
        idClient: number,
        nom: string,
        prenom: string,
        date_naissance: Date,
        adresse: string,
        contact: string,
        email: string,
        mdp: string,
        cin: string,
        genre: Genre,
        status: number,
    ) {
        this.idClient = idClient;
        this.nom = nom;
        this.prenom = prenom;
        this.date_naissance = date_naissance;
        this.adresse = adresse;
        this.contact = contact;
        this.email = email;
        this.mdp = mdp;
        this.cin = cin;
        this.genre = genre;
        this.status = status;
    }

    // Getters
    getIdClient(): number {
        return this.idClient;
    }

    getNom(): string {
        return this.nom;
    }

    getPrenom(): string {
        return this.prenom;
    }
    
    getGenre(): Genre {
        return this.genre;
    }

    getDateNaissance(): Date {
        return this.date_naissance;
    }

    getAdresse(): string {
        return this.adresse;
    }

    getContact(): string {
        return this.contact;
    }

    getEmail(): string {
        return this.email;
    }

    getMdp(): string {
        return this.mdp;
    }

    getCin(): string {
        return this.cin;
    }

    getStatus(): number {
        return this.status;
    }
    
    setIdClient(idClient: number): void {
        this.idClient = idClient;
    }

    setNom(nom: string): void {
        this.nom = nom;
    }

    setGenre(Genre: Genre): void {
        this.genre = Genre;
    }

    setPrenom(prenom: string): void {
        this.prenom = prenom;
    }

    setDateNaissance(date_naissance: Date): void {
        this.date_naissance = date_naissance;
    }

    setAdresse(adresse: string): void {
        this.adresse = adresse;
    }

    setContact(contact: string): void {
        this.contact = contact;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setMdp(mdp: string): void {
        this.mdp = mdp;
    }

    setCin(cin: string): void {
        this.cin = cin;
    }

    setStatus(status: number): void {
        this.status = status;
    }
}
