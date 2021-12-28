export class Settings {
  constructor() {
  }

  public readonly rows: number = 10;
  public readonly columns:number = 10;
  public readonly minNextAtoms: number = 5;
  public readonly maxNextAtoms: number = 10;
  
  public readonly scorePerProton: number = 10;
  public readonly scorePerMolecule: number = 100;
  public readonly scorePerLevel: number = 1000;
  public readonly levelDelay: number = 1000; //milisec
  public readonly maxLevel: number = 10;
}