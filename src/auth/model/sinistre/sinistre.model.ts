import { Contrat } from "../contrat/contrat.model";
import { TypeAccident } from "./typeAccident.model";

export class Sinistre {
  private idSinistre: string;
  private contrat: Contrat;
  private date_heure_incident: Date;
  private lieu_incident: string;
  private description: string;
  private expert: number;
  private status: number;
  private typeAccident: TypeAccident;
  private photos: Array<string>;

  constructor(
    idSinistre: string,
    contrat: Contrat,
    date_heure_incident: Date,
    lieu_incident: string,
    description: string,
    expert: number,
    status: number,
    typeAccident: TypeAccident,
    photos: Array<string>
  ) {
    this.idSinistre = idSinistre;
    this.contrat = contrat;
    this.date_heure_incident = date_heure_incident;
    this.lieu_incident = lieu_incident;
    this.description = description;
    this.expert = expert;
    this.status = status;
    this.typeAccident = typeAccident;
    this.photos = photos;
  }

  public getPhotos(): Array<string>{
    return this.photos;
  }

  public setPhotos(photos: Array<string>): void{
    this.photos = photos;
  }

  public getIdSinistre(): string {
    return this.idSinistre;
  }

  public setIdSinistre(idSinistre: string): void {
    this.idSinistre = idSinistre;
  }

  public getContrat(): Contrat {
    return this.contrat;
  }

  public setContrat(contrat: Contrat): void {
    this.contrat = contrat;
  }

  public getDateHeureIncident(): Date {
    return this.date_heure_incident;
  }

  public setDateHeureIncident(date_heure_incident: Date): void {
    this.date_heure_incident = date_heure_incident;
  }

  public getLieuIncident(): string {
    return this.lieu_incident;
  }

  public setLieuIncident(lieu_incident: string): void {
    this.lieu_incident = lieu_incident;
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

  public getExpert(): number {
    return this.expert;
  }

  public setExpert(expert: number): void {
    this.expert = expert;
  }

  public getStatus(): number {
    return this.status;
  }

  public setStatus(status: number): void {
    this.status = status;
  }

  public getTypeAccident(): TypeAccident {
    return this.typeAccident;
  }

  public setTypeAccident(typeAccident: TypeAccident): void {
    this.typeAccident = typeAccident;
  }
}
