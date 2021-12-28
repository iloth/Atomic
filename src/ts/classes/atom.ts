import { ElementHelper } from "../helpers/element.js";

export class Atom {
  constructor(protons: number) {
    this.protons = protons;
    this.setElement();
  }
  
  public readonly protons: number;
  
  public get freeElectrons(): number {
    const connections = (this._connectedTop ? 1 : 0) +
      (this._connectedRight ? 1 : 0) +
      (this._connectedBottom ? 1 : 0) +
      (this._connectedLeft ? 1 : 0);
    
    return this.protons - connections;
  }
  
  private _connectedTop: boolean = false;
  public get connectedTop(): boolean {
    return this._connectedTop;
  }
  public set connectedTop(value: boolean) {
    if (this.freeElectrons === 0 && value && !this._connectedTop) {
      throw new Error('No more free electron!');
    } else {
      this.element.classList.remove(`free--${this.freeElectrons}`);
      this._connectedTop = value;
      if (value) {
        this._element.classList.add('connected--t');
      } else {
        this._element.classList.remove('connected--t');
      }
      this.element.classList.add(`free--${this.freeElectrons}`);
    }
  }
  
  private _connectedRight: boolean = false;
  public get connectedRight(): boolean {
    return this._connectedRight;
  }
  public set connectedRight(value: boolean) {
    if (this.freeElectrons === 0 && value && !this._connectedRight) {
      throw new Error('No more free electron!');
    } else {
      this.element.classList.remove(`free--${this.freeElectrons}`);
      this._connectedRight = value;
      if (value) {
        this._element.classList.add('connected--r');
      } else {
        this._element.classList.remove('connected--r');
      }
      this.element.classList.add(`free--${this.freeElectrons}`); 
    }
  }

  private _connectedBottom: boolean = false;
  public get connectedBottom(): boolean {
    return this._connectedBottom;
  }
  public set connectedBottom(value: boolean) {
    if (this.freeElectrons === 0 && value && !this._connectedBottom) {
      throw new Error('No more free electron!');
    } else {
      this.element.classList.remove(`free--${this.freeElectrons}`);
      this._connectedBottom = value;
      if (value) {
        this._element.classList.add('connected--b');
      } else {
        this._element.classList.remove('connected--b');
      }
      this.element.classList.add(`free--${this.freeElectrons}`); 
    }
  }
  
  private _connectedLeft: boolean = false;
  public get connectedLeft(): boolean {
    return this._connectedLeft;
  }
  public set connectedLeft(value: boolean) {
    if (this.freeElectrons === 0 && value && !this._connectedLeft) {
      throw new Error('No more free electron!');
    } else {
      this.element.classList.remove(`free--${this.freeElectrons}`);
      this._connectedLeft = value;
      if (value) {
        this._element.classList.add('connected--l');
      } else {
        this._element.classList.remove('connected--l');
      }
      this.element.classList.add(`free--${this.freeElectrons}`); 
    }
  }

  private _element: HTMLElement;
  private setElement() {
    const classes: string[] = ['atom', `atom--${this.protons}`, `free--${this.freeElectrons}`];
    if (this._connectedTop) classes.push('connected--t');
    if (this._connectedRight) classes.push('connected--r');
    if (this._connectedBottom) classes.push('connected--b');
    if (this._connectedLeft) classes.push('connected--l');

    this._element = ElementHelper.Create('div', { id: null, classList: classes },
      ElementHelper.Create('div', { id: null, classList: ['nucleus'] }),
      ElementHelper.Create('div', { id: null, classList: ['electrons'] },
        ElementHelper.Create('div', { id: null, classList: ['electron', 'electron--1'] }),
        ElementHelper.Create('div', { id: null, classList: ['electron', 'electron--2'] }),
        ElementHelper.Create('div', { id: null, classList: ['electron', 'electron--3'] }),
        ElementHelper.Create('div', { id: null, classList: ['electron', 'electron--4'] })
      ),
      ElementHelper.Create('div', { id: null, classList: ['connections'] },
        ElementHelper.Create('div', { id: null, classList: ['connection', 'connection--t'] }),
        ElementHelper.Create('div', { id: null, classList: ['connection', 'connection--r'] }),
        ElementHelper.Create('div', { id: null, classList: ['connection', 'connection--b'] }),
        ElementHelper.Create('div', { id: null, classList: ['connection', 'connection--l'] })
      )
    );
  }
  public get element(): HTMLElement {
    return this._element;
  }

  public clone(): Atom {
    const atom = new Atom(this.protons);
    atom.connectedTop = this._connectedTop;
    atom.connectedRight = this._connectedRight;
    atom.connectedBottom = this._connectedBottom;
    atom.connectedLeft = this._connectedLeft;

    return atom;
  }
}