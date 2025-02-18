export class TypeAccident {
    private idTypeIncident: number;
    private nom: string;
    private status: number;
  
    constructor(idTypeIncident: number, nom: string, status: number) {
      this.idTypeIncident = idTypeIncident;
      this.nom = nom;
      this.status = status;
    }
  
    public getIdTypeIncident(): number {
      return this.idTypeIncident;
    }
  
    public setIdTypeIncident(idTypeIncident: number): void {
      this.idTypeIncident = idTypeIncident;
    }
  
    public getNom(): string {
      return this.nom;
    }
  
    public setNom(nom: string): void {
      this.nom = nom;
    }
  
    public getStatus(): number {
      return this.status;
    }
  
    public setStatus(status: number): void {
      this.status = status;
    }
  }
  