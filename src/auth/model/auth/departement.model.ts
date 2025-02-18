export class Departement {
    private idDepartement: number;
    private nom: string;
    private nomResponsable: string;
    private contactResponsable: string;
    private localisation: string;
    private status: number;
    private code: string;

   constructor(
        idDepartement: number,
        nom: string,
        nomResponsable: string,
        contactResponsable: string,
        localisation: string,
        status: number,
        code: string
    ) {
        this.setIdDepartement(idDepartement);
        this.setNom(nom);
        this.setNomResponsable(nomResponsable);
        this.setContactResponsable(contactResponsable);
        this.setLocalisation(localisation);
        this.setStatus(status);
        this.setCode(code);
    }

    // Getters et setters
    public getIdDepartement(): number {
        return this.idDepartement;
    }

    public setIdDepartement(value: number) {
        this.idDepartement = value;
    }

    public getNom(): string {
        return this.nom;
    }

    public setNom(value: string) {
        this.nom = value;
    }

    public getNomResponsable(): string {
        return this.nomResponsable;
    }

    public setNomResponsable(value: string) {
        this.nomResponsable = value;
    }

    public getContactResponsable(): string {
        return this.contactResponsable;
    }

    public setContactResponsable(value: string) {
        this.contactResponsable = value;
    }

    public getLocalisation(): string {
        return this.localisation;
    }

    public setLocalisation(value: string) {
        this.localisation = value;
    }

    public getStatus(): number {
        return this.status;
    }

    public setStatus(value: number) {
        this.status = value;
    }

    public getCode(): string {
        return this.code;
    }

    public setCode(value: string) {
        this.code = value;
    }
}
