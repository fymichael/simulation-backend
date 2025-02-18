import { Carrosserie } from "./carrosserie.model";
import { Energie } from "./energie.model";
import { Marque } from "./marque.model";

export class Vehicule {
    private idVehicule: number;
    private marque: Marque;
    private carrosserie: Carrosserie;
    private energie: Energie;
    private model: string;
    private numero_chassit: string;
    private puissance: number;
    private numero_moteur: string;
    private nombre_place: number;
    private plaque_immatriculation: string;
    private date_circulation: Date;
    private valeur_nette: number;

    constructor(
        idVehicule: number,
        marque: Marque,
        carrosserie: Carrosserie,
        energie: Energie,
        model: string,
        numero_chassit: string,
        puissance: number,
        numero_moteur: string,
        nombre_place: number,
        plaque_immatriculation: string,
        date_circulation: Date,
        valeur_nette: number
    ) {
        this.idVehicule = idVehicule;
        this.marque = marque;
        this.carrosserie = carrosserie;
        this.energie = energie;
        this.model = model;
        this.numero_chassit = numero_chassit;
        this.puissance = puissance;
        this.numero_moteur = numero_moteur;
        this.nombre_place = nombre_place;
        this.plaque_immatriculation = plaque_immatriculation;
        this.date_circulation = date_circulation;
        this.valeur_nette = valeur_nette;
    }

    // Getters
    getIdVehicule(): number {
        return this.idVehicule;
    }

    getMarque(): Marque {
        return this.marque;
    }

    getCarrosserie(): Carrosserie {
        return this.carrosserie;
    }

    getEnergie(): Energie {
        return this.energie;
    }

    getModel(): string {
        return this.model;
    }

    getNumeroChassit(): string {
        return this.numero_chassit;
    }

    getPuissance(): number {
        return this.puissance;
    }

    getNumeroMoteur(): string {
        return this.numero_moteur;
    }

    getNombrePlace(): number {
        return this.nombre_place;
    }

    getPlaqueImmatriculation(): string {
        return this.plaque_immatriculation;
    }

    getDateCirculation(): Date {
        return this.date_circulation;
    }

    getValeurNette(): number {
        return this.valeur_nette;
    }

    // Setters
    setIdVehicule(idVehicule: number): void {
        this.idVehicule = idVehicule;
    }

    setMarque(marque: Marque): void {
        this.marque = marque;
    }

    setCarrosserie(carrosserie: Carrosserie): void {
        this.carrosserie = carrosserie;
    }

    setEnergie(energie: Energie): void {
        this.energie = energie;
    }

    setModel(model: string): void {
        this.model = model;
    }

    setNumeroChassit(numero_chassit: string): void {
        this.numero_chassit = numero_chassit;
    }

    setPuissance(puissance: number): void {
        this.puissance = puissance;
    }

    setNumeroMoteur(numero_moteur: string): void {
        this.numero_moteur = numero_moteur;
    }

    setNombrePlace(nombre_place: number): void {
        this.nombre_place = nombre_place;
    }

    setPlaqueImmatriculation(plaque_immatriculation: string): void {
        this.plaque_immatriculation = plaque_immatriculation;
    }

    setDateCirculation(date_circulation: Date): void {
        this.date_circulation = date_circulation;
    }

    setValeurNette(valeur_nette: number): void {
        this.valeur_nette = valeur_nette;
    }
}
