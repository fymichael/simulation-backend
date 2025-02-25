/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Vehicule } from 'src/auth/model/vehicule/Vehicule.model';
import { DatabaseService } from 'src/auth/service/database.service';
import { MarqueService } from './marque.service';
import { CarrosserieService } from './carrosserie.service';
import { EnergieService } from './energie.service';

@Injectable()
export class VehiculeService {
    private Vehicule: Vehicule | null = null;
    private marqueService: MarqueService; 
    private carrosserieService: CarrosserieService; 
    private energieService: EnergieService; 

    constructor(private readonly databaseService: DatabaseService, marqueService: MarqueService, carrosserieService: CarrosserieService, energieService: EnergieService) {
        this.marqueService = marqueService;
        this.carrosserieService = carrosserieService;
        this.energieService = energieService;

     }

    getVehicule() {
        return this.Vehicule;
    }

    setVehicule(Vehicule: Vehicule) {
        this.Vehicule = Vehicule;
    }

    async getAllVehicule(): Promise<Array<Vehicule>> {
        const query = 'SELECT * FROM client where status != 0';
        let vehicules = [];
        const resultat = await this.databaseService.executeQuery(query);
        for (let i = 0; i < resultat.length; i++) {
            const marque = await this.marqueService.getMarqueById(resultat[i].id_marque);
            const carrosserie = await this.carrosserieService.getCarrosserieById(resultat[i].id_carrosserie);
            const energie = await this.energieService.getEnergieById(resultat[i].id_energie);
            const vehicule = new Vehicule(resultat[i].id_vehicule, marque, carrosserie, energie, resultat[i].model, resultat[i].numero_chassit, resultat[i].puissance, resultat[i].numero_moteur, resultat[i].nombre_place, resultat[i].plaque_immatriculation, resultat[i].date_circulation, resultat[i].valeur_nette);
            vehicules.push(vehicule);
        }
        return vehicules;
    }

    async getLastVehicule(): Promise<Vehicule> {
        const query = 'SELECT * FROM Vehicule order by id_vehicule desc limit 1';
        const resultat = await this.databaseService.executeQuery(query);

        if (resultat.length === 0) {
            throw new Error('Vehicule not found');
        }

        const marque = await this.marqueService.getMarqueById(resultat[0].id_marque);
        const carrosserie = await this.carrosserieService.getCarrosserieById(resultat[0].id_carrosserie);
        const energie = await this.energieService.getEnergieById(resultat[0].id_energie);
        const vehicule = new Vehicule(resultat[0].id_vehicule, marque, carrosserie, energie, resultat[0].model, resultat[0].numero_chassit, resultat[0].puissance, resultat[0].numero_moteur, resultat[0].nombre_place, resultat[0].plaque_immatriculation, resultat[0].date_circulation, resultat[0].valeur_nette);

        return vehicule;
    }

    async getVehiculeById(idVehicule: number): Promise<Vehicule> {
        const query = 'SELECT * FROM Vehicule where id_vehicule = '+idVehicule;
        const resultat = await this.databaseService.executeQuery(query);

        if (resultat.length === 0) {
            throw new Error('Vehicule not found');
        }

        const marque = await this.marqueService.getMarqueById(resultat[0].id_marque);
        const carrosserie = await this.carrosserieService.getCarrosserieById(resultat[0].id_carrosserie);
        const energie = await this.energieService.getEnergieById(resultat[0].id_energie);
        const vehicule = new Vehicule(resultat[0].id_vehicule, marque, carrosserie, energie, resultat[0].model, resultat[0].numero_chassit, resultat[0].puissance, resultat[0].numero_moteur, resultat[0].nombre_place, resultat[0].plaque_immatriculation, resultat[0].date_circulation, resultat[0].valeur_nette);

        return vehicule;
    }

    async newVehicule(id_marque: number,model: string, id_carrosserie: string, numero_chassit: string, puissance: number, numero_moteur: string, nombre_place: number, id_energie: number, plaque_immatriculation: string, date_circulation: Date, valeur_nette: number) {
        const query = `insert into Vehicule (id_marque, model, id_carrosserie, numero_chassit, puissance, numero_moteur, nombre_place, id_energie, plaque_immatriculation, date_circulation, valeurs_nette) values (${id_marque}, '${model}', ${id_carrosserie}, '${numero_chassit}', ${puissance}, '${numero_moteur}', ${nombre_place}, ${id_energie}, '${plaque_immatriculation}', '${date_circulation}', ${valeur_nette})`;
        console.log(query)
        return await this.databaseService.executeQuery(query);
    }

    async newVehiculeSimulation( puissance: number, id_energie: number, valeur_nette: number) {
        const query = `insert into Vehicule (puissance, id_energie, valeurs_nette) values (${puissance}, ${id_energie}, ${valeur_nette})`;
        console.log(query)
        return await this.databaseService.executeQuery(query);
    }

    async updateVehicule(idVehicule: number, idMarque: number, model: string, idCarrosserie: number, numeroChassit: string, puissance: number, numeroMoteur: string, nombrePlace: string, idEnergie: number, plaqueImmatriculation: string, dateCirculation: Date, valeursNette: number) {
        const query = `update vehicule set id_marque = ${idMarque}, model = '${model}', id_carrosserie = ${idCarrosserie}, numero_chassit = '${numeroChassit}', puissance = ${puissance}, numero_moteur = '${numeroMoteur}', nombre_place = ${nombrePlace}, id_energie = ${idEnergie}, plaque_immatriculation = '${plaqueImmatriculation}', date_circulation = '${dateCirculation}', valeurs_nette = ${valeursNette} where id_vehicule = ${idVehicule}`;
        console.log(query);
        return await this.databaseService.executeQuery(query);
    }

    async deleteVehicule(idVehicule: number) {
        const query = 'update Vehicule set status = 0 where id_Vehicule = ?';
        return await this.databaseService.executeQuery(query, [idVehicule]);
    }
}
