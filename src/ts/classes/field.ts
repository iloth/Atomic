import { Atom } from "./atom.js";

export class Field {
  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
    this.element = document.querySelector(`.field[data-row="${row}"][data-col="${col}"]`);
  }

  public readonly row: number;
  public readonly col: number;
  public readonly element: Element;
  
  private _atom?:Atom = null;
  public get atom(): Atom | null {
    return this._atom;
  }
  public set atom(value: Atom | null) {
    if (this._atom) {
      this._atom.element.remove();
    }
    this._atom = value;
    if (value) {
      this.element.appendChild(value.element);
      setTimeout(() => {
        if (this._atom) {
          this._atom.element.classList.remove('new');      
        }
      }, 100);
    }
  }
}