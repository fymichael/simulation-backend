import { Departement } from "./departement.model";
import { Role } from "./role.model";

export class User {
  private idUtilisateur: number;
  private nom: string;
  private prenom: string;
  private adresse: string;
  private contact: string;
  private email: string;
  private mdp: string;
  private numeroMatricule: string;
  private departement: Departement;
  private role: Role;
  private status: number;

  // Constructeur
  constructor(
    idUtilisateur: number,
    nom: string,
    prenom: string,
    adresse: string,
    contact: string,
    email: string,
    mdp: string,
    numeroMatricule: string,
    departement: Departement,
    role: Role,
    status: number
  ) {
    this.idUtilisateur = idUtilisateur;
    this.nom = nom;
    this.prenom = prenom;
    this.adresse = adresse;
    this.contact = contact;
    this.email = email;
    this.mdp = mdp;
    this.numeroMatricule = numeroMatricule;
    this.departement = departement;
    this.role = role;
    this.status = status;
  }

  // Getters et setters
  public getIdUtilisateur(): number {
    return this.idUtilisateur;
  }

  public setIdUtilisateur(value: number) {
    this.idUtilisateur = value;
  }

  public getNom(): string {
    return this.nom;
  }

  public setNom(value: string) {
    this.nom = value;
  }

  public getPrenom(): string {
    return this.prenom;
  }

  public setPrenom(value: string) {
    this.prenom = value;
  }

  public getAdresse(): string {
    return this.adresse;
  }

  public setAdresse(value: string) {
    this.adresse = value;
  }

  public getContact(): string {
    return this.contact;
  }

  public setContact(value: string) {
    this.contact = value;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(value: string) {
    this.email = value;
  }

  public getMdp(): string {
    return this.mdp;
  }

  public setMdp(value: string) {
    this.mdp = value;
  }

  public getNumeroMatricule(): string {
    return this.numeroMatricule;
  }

  public setNumeroMatricule(value: string) {
    this.numeroMatricule = value;
  }

  public getDepartement(): Departement {
    return this.departement;
  }

  public setDepartement(value: Departement) {
    this.departement = value;
  }

  public getRole(): Role {
    return this.role;
  }

  public setRole(value: Role) {
    this.role = value;
  }

  public getStatus(): number {
    return this.status;
  }

  public setStatus(value: number) {
    this.status = value;
  }
}
