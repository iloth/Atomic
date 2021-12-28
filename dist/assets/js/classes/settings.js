export class Settings {
    constructor() {
        this.rows = 10;
        this.columns = 10;
        this.minNextAtoms = 5;
        this.maxNextAtoms = 10;
        this.scorePerProton = 10;
        this.scorePerMolecule = 100;
        this.scorePerLevel = 1000;
        this.levelDelay = 1000; //milisec
        this.maxLevel = 10;
    }
}
