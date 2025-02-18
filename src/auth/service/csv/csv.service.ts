import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';

@Injectable()
export class CsvService {
    constructor(private readonly databaseService: DatabaseService) { }

    async readCsv(fileName: string): Promise<any[]> {
        const fullPath = path.join(__dirname, '..', '..', '..', '..', '/src/auth/files_csv/', fileName);
        const results: any[] = [];

        return new Promise((resolve, reject) => {
            fs.createReadStream(fullPath)
                .pipe(csvParser({ separator: ';' }))
                .on('data', (data) => {
                    const cleanedData = Object.fromEntries(
                        Object.entries(data).map(([key, value]) => [
                            String(key).trim().replace(/^'|'$/g, ''),
                            String(value).trim(),
                        ])
                    );
                    results.push(cleanedData);
                })

                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }

    // Fonction pour inserer les données du csv concernant le contrat dans la table temporaire
    async insertContratData(fileName: string): Promise<any> {
        const resultats = await this.readCsv(fileName);

        for (const contrat of resultats) {
            // Insertion dans la table temporaire
            const query = `
                INSERT INTO import_contrat (numero_police, email_client, numero_vehicule, date_debut, duree, classification, reduction, procedure_paiement, garanties, exoneration, matricule_agent, date_echeance)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `;
            const values = [
                contrat.numero_police,
                contrat.email_client,
                contrat.numero_vehicule,
                contrat.date_debut,
                contrat.duree,
                contrat.classification,
                contrat.reduction,
                contrat.procedure_paiement,
                contrat.garanties,
                contrat.exoneration,
                contrat.matricule_agent,
                contrat.date_echeance,
            ];

            await this.databaseService.executeQuery(query, values);

            const resultat = await this.dispatchContratData();

            if (resultat && resultat[0]) {
                const queryMontant = `SELECT 
            SUM(montant_garanties + montant_duree + montant_exoneration + accessoires) - 
                 ((SUM(montant_garanties + montant_duree + montant_exoneration + accessoires) * reduction) / 100) AS net_payer
    FROM 
        v_montant_total 
    WHERE 
        id_contrat = ${resultat[0].id_contrat} 
    GROUP BY 
        id_contrat, reduction;
    `;
                console.log(queryMontant);
                const resultMontant = await this.databaseService.executeQuery(queryMontant);

                const update = `UPDATE contrat SET montant_total = ${resultMontant[0]?.net_payer} WHERE id_contrat = ${resultat[0].id_contrat}`;
                console.log(update);

                await this.databaseService.executeQuery(update);
                await this.insertProceduresPaiement(resultat[0].id_contrat);
                await this.insertGaranties(resultat[0].id_contrat);
            }
        }
    }


    formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    async getDateEcheance(date: Date, duree: number): Promise<string> {
        const dateDebutObj = typeof date === 'string' ? new Date(date) : date;
        const dateEcheance = new Date(dateDebutObj)
        dateEcheance.setMonth(dateDebutObj.getMonth() + duree);
        dateEcheance.setDate(dateEcheance.getDate() + 1);
        return this.formatDate(dateEcheance)
    }

    // Fonction principale pour inserer dans la table contrat
    async dispatchContratData(): Promise<any> {
        const query = `
            INSERT INTO contrat (numero_police, id_client, id_vehicule, date_debut, duree, date_echeance, id_classification, reduction, montant_total, id_exoneration, id_utilisateur) 
            SELECT i.numero_police, c.id_client, v.id_vehicule, i.date_debut, i.duree, i.date_echeance, cl.id_classification, i.reduction, 0, e.id_exoneration, u.id_utilisateur 
            FROM import_contrat i
            JOIN client c ON c.email = i.email_client
            JOIN vehicule v ON v.plaque_immatriculation = i.numero_vehicule
            JOIN classification cl ON cl.nom = i.classification
            JOIN exoneration e ON e.nom = i.exoneration
            JOIN utilisateur u ON u.numero_matricule = i.matricule_agent 
            WHERE i.numero_police = $1
            RETURNING id_contrat;
        `;

        return this.databaseService.executeQuery(query);
    }


    // Fonction pour inserer le procedure paiements
    async insertProceduresPaiement(id_contrat: number) {
        const queryContrat = "select * from contrat where id_contrat = " + id_contrat;
        console.log(queryContrat);
        const rest = await this.databaseService.executeQuery(queryContrat);

        const queryNumPolice = "select * from import_contrat where numero_police = '" + rest[0].numero_police + "'";
        console.log(queryNumPolice);
        const resu = await this.databaseService.executeQuery(queryNumPolice);

        const procedureArray = resu[0].procedure_paiement.split(',');

        procedureArray.forEach(procedure => {
            const procedureSplitted = procedure.split(' ');
            const datePaiement = new Date(procedureSplitted[0]);
            const pourcentage = procedureSplitted[1];

            const query = `insert into procedure_paiement (date_paiement, pourcentage, id_contrat) values ('${this.formatDate(datePaiement)}', ${pourcentage}, ${id_contrat})`;
            console.log(query)
            return this.databaseService.executeQuery(query);
        });
    }

    // Fonction pour inserer les garanties
    async insertGaranties(id_contrat: number) {
        const queryContrat = "select * from contrat where id_contrat = " + id_contrat;
        console.log(queryContrat);
        const rest = await this.databaseService.executeQuery(queryContrat);

        const queryNumPolice = "select * from import_contrat where numero_police = '" + rest[0].numero_police + "'";
        console.log(queryNumPolice);
        const resu = await this.databaseService.executeQuery(queryNumPolice);

        const garantiesArray = resu[0].garanties.split(',');
        garantiesArray.forEach(garanty => {
            if (String(garanty).trim() !== '') {
                const query = `insert into garantie_contrat (id_garantie, id_contrat) 
                select g.id_garantie, ${id_contrat}
            from garantie g
            where g.nom = '${garanty}'`;

                console.log(query)

                return this.databaseService.executeQuery(query);
            }
        });
    }

    // Fonction pour inserer les données du csv dans la table temporaire
    async insertVehiculeData(fileName: string): Promise<any> {
        const resultats = await this.readCsv(fileName);

        const insertPromises = resultats.map(async (vehicule) => {
            const query = `
        INSERT INTO import_vehicule (marque, modele, carrosserie, numero_chassit, puissance, numero_moteur, nombre_place, energie, plaque_immatriculation, date_circulation, valeurs_nette)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `;

            const values = [
                vehicule.marque,
                vehicule.modele,
                vehicule.carrosserie,
                vehicule.numero_chassit,
                vehicule.puissance,
                vehicule.numero_moteur,
                vehicule.nombre_place,
                vehicule.energie,
                vehicule.plaque_immatriculation,
                vehicule.date_circulation,
                vehicule.valeurs_nette
            ];

            return await this.databaseService.executeQuery(query, values);
        });

        await Promise.all(insertPromises);

        await this.dispatchVehiculeData();
    }

    // Fonction pour inserer les données du csv vehicules
    async dispatchVehiculeData(): Promise<any> {
        const query = `
    INSERT INTO vehicule (id_marque, model, id_carrosserie, numero_chassit, puissance, numero_moteur, nombre_place, id_energie, plaque_immatriculation, date_circulation, valeurs_nette)
    SELECT m.id_marque, i.modele, c.id_carrosserie, i.numero_chassit, i.puissance, i.numero_moteur, i.nombre_place, e.id_energie, i.plaque_immatriculation, i.date_circulation, i.valeurs_nette
    FROM import_vehicule i
    JOIN marque m on m.nom = i.marque
    JOIN carrosserie c on c.nom = i.carrosserie
    JOIN energie e on e.nom = i.energie
  `;
        return await this.databaseService.executeQuery(query);
    }

    // Fonction qui permet de séparer les données obtenues du CSV dans leurs tables respectives
    async dispatchClientData(): Promise<any> {
        const query = `
      INSERT INTO client (nom, prenom, date_naissance, adresse, contact, email, mdp, id_genre, cin)
      SELECT i.nom, i.prenom, i.date_naissance, i.adresse, i.contact, i.email, i.mdp, g.id_genre, i.cin
      FROM import_client i
      JOIN genre g ON g.nom = i.genre
    `;
        return await this.databaseService.executeQuery(query);
    }

    // Fonction qui permet d'insérer dans la table temporaire les données du CSV client
    async insertClientData(fileName: string): Promise<any> {
        const resultats = await this.readCsv(fileName);

        const insertPromises = resultats.map(async (client) => {
            const query = `
        INSERT INTO import_client (nom, prenom, date_naissance, adresse, contact, email, mdp, genre, cin)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;

            const values = [
                client.nom,
                client.prenom,
                client.date_naissance,
                client.adresse,
                client.contact,
                client.email,
                client.mdp,
                client.genre,
                client.cin
            ];

            return await this.databaseService.executeQuery(query, values);
        });

        await Promise.all(insertPromises);

        await this.dispatchClientData();
    }
}
