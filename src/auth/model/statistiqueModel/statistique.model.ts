export class Statistique {
    constructor(
        private label: string,
        private valeurs: number,
    ) {}

    getLabel(): string {
        return this.label;
    }

    setLabel(label: string): void {
        this.label = label;
    }

    getValeurs(): number {
        return this.valeurs;
    }

    setValeurs(valeurs: number): void {
        this.valeurs = valeurs;
    }
}
