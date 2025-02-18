import { Sinistre } from "./sinistre.model";

export class PhotoSinistre {
  private idPhotoSinistre: number;
  private sinistre: Sinistre;
  private lien_photo: string;

  constructor(idPhotoSinistre: number, sinistre: Sinistre, lien_photo: string) {
    this.idPhotoSinistre = idPhotoSinistre;
    this.sinistre = sinistre;
    this.lien_photo = lien_photo;
  }

  public getIdPhotoSinistre(): number {
    return this.idPhotoSinistre;
  }

  public setIdPhotoSinistre(idPhotoSinistre: number): void {
    this.idPhotoSinistre = idPhotoSinistre;
  }

  public getSinistre(): Sinistre {
    return this.sinistre;
  }

  public setSinistre(sinistre: Sinistre): void {
    this.sinistre = sinistre;
  }

  public getLienPhoto(): string {
    return this.lien_photo;
  }

  public setLienPhoto(lien_photo: string): void {
    this.lien_photo = lien_photo;
  }
}
