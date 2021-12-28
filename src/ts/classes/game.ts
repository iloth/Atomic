import { Random } from "../helpers/random.js";
import { Atom } from "./atom.js";
import { Board } from "./board.js";
import { Controls } from "./controls.js";
import { Field } from "./field.js";
import { Settings } from "./settings.js";

export class Game {
  constructor() {    
  }

  public readonly settings: Settings = new Settings();
  public readonly board: Board = new Board(this);
  public readonly controls: Controls = new Controls(this);
  public nextAtoms: Atom[] = [];
  private _timerID: number;
  private _atomDropped: number;

  private _level: number = 10;
  public get level(): number {
    return this._level;
  }
  private set level(value) {
    this._level = value;
    this.controls.levelLabel.innerText = `${value}/${this.settings.maxLevel}`;
  }

  private _score: number = 0;
  public get score(): number {
    return this._score;
  }
  private set score(value) {
    this._score = value;
    this.controls.scoreLabel.innerText = value.toString();
    if (this._level < this.settings.maxLevel) {
      this.level = 1 + Math.floor(this._score / this.settings.scorePerLevel);
    }
  }

  private _molecules: number = 0;
  public get molecules(): number {
    return this._molecules;
  }
  private set molecules(value) {
    this._molecules = value;
    this.controls.moleculesLabel.innerText = value.toString();
  }

  private set timeBar(value: number) {
    this.controls.timeBar.style.width = `${100 - value}%`;
    this.controls.timeBar.classList.remove('warning', 'danger');
    if (value > 70) {
      this.controls.timeBar.classList.add('danger');
    } else if (value > 50) {
      this.controls.timeBar.classList.add('warning');
    }
  }

  public startClick(): void {
    this.level = 1;
    this.score = 0;
    this.molecules = 0;

    this.board.clear;

    while (this.nextAtoms.length > 0) {
      this.removeNext(this.nextAtoms.pop());
    }
    for (let i = 1; i <= this.settings.minNextAtoms; i++) {
      this.addNext();
    }

    this.controls.gameOverLabel.style.display = 'none';
    this.controls.startButton.disabled = true;
    this.controls.pauseButton.disabled = false;
    
    this.startTimer();
  }

  public pauseClick(): void {
    clearInterval(this._timerID);
    this.board.disable();
    this.controls.mainDiv.classList.add('paused');
    this.controls.pauseLabel.style.display = 'block';
  }

  public continueClick(): void {
    this.startTimer();
    this.board.enable();
    this.controls.mainDiv.classList.remove('paused');
    this.controls.pauseLabel.style.display = 'none';
  }
  
  public fieldClick(field: Field): void {
    if (field.atom === null) {
      
      const nextAtom = this.nextAtoms.shift();
      if (nextAtom) {
        const newAtom = this.getNewAtom(nextAtom, field);

        newAtom.element.classList.add('new');
        field.atom = newAtom;
        
        if (this.nextAtoms.length <= this.settings.minNextAtoms) {
          this.addNext();
        }
        this.removeNext(nextAtom);

        const molecule = this.checkMolecule(field);
        if (molecule) {
          this.removeMolecule(molecule);
          this.score += this.settings.scorePerMolecule;
          this.molecules += 1;
        }

        this.score += this.settings.scorePerProton * nextAtom.protons;
      }
    }
  }

  private startTimer() {
    this._timerID = setInterval(() => { this.timerTick(); }, 100);
  }

  private timerTick() {
    const delay = (this.settings.maxLevel - this.level + 1) * this.settings.levelDelay;
    this._atomDropped += 100;
    if (this._atomDropped > delay) {
      this.addNext();
    } else {
      const timePercent = Math.floor(this._atomDropped * 100 / delay);
      this.timeBar = timePercent;
    }

  }

  private addNext() {
    if (this.nextAtoms.length < this.settings.maxNextAtoms) {
      const atom = new Atom(Random.Int(1, 4));
      this.nextAtoms.push(atom);

      atom.element.classList.add('new');
      document.querySelector('.controls .next .tube').appendChild(atom.element);
      setTimeout(() => {
        atom.element.classList.remove('new');
      }, 100);

      this._atomDropped = 0;
      this.timeBar = 0;

    } else {
      this.timeBar = 100;
      this.gameOver();
      this.controls.startButton.disabled = false;
    }
  }

  private removeNext(nextAtom: Atom) {
    nextAtom.element.classList.add('destructing');
    nextAtom.element.addEventListener('transitionend', (e) => {
      nextAtom.element.remove();
    });

  }

  private checkMolecule(startField: Field): Field[] | null {
    const stack: Field[] = [startField];
    const found: Field[] = [startField];
    
    const checkField = (field: Field): boolean => {
      if (field.atom.freeElectrons > 0) {
        return true;
      } else if (!found.some((f) => f.row === field.row && f.col === field.col)) {
        found.push(field);
        stack.push(field);
        return false;
      }
    };

    // depth first search algorithm
    // https://www.youtube.com/watch?v=iaBEKo5sM7w
    while (stack.length > 0) {
      const field = stack.pop();

      if (field.atom.freeElectrons > 0) {
        return null;
      } else if (field.atom.connectedTop && checkField(this.board.fields[field.row - 1][field.col])) {
        return null;
      } else if (field.atom.connectedRight && checkField(this.board.fields[field.row][field.col + 1])) {
        return null;
      } else if (field.atom.connectedBottom && checkField(this.board.fields[field.row + 1][field.col])) {
        return null;
      } else if (field.atom.connectedLeft && checkField(this.board.fields[field.row][field.col - 1])) {
        return null;
      }
    }

    return found;
  }

  private removeMolecule(fields: Field[]): void {
    fields.forEach((field) => {
      field.atom.element.classList.add('destructing');
      field.atom.element.addEventListener('transitionend', (e) => {
        field.atom = null;
      });
    });
    //workaround: last dropped atom (first in the array) remains
    //TODO: bugfix
    fields[0].atom = null;
  }

  private getNewAtom(next: Atom, field: Field): Atom {
    const newAtom = next.clone();

    //connection top
    if (field.row > 0) {
      const topAtom = this.board.fields[field.row - 1][field.col].atom;
      if (topAtom && topAtom.freeElectrons > 0) {
        topAtom.connectedBottom = true;
        newAtom.connectedTop = true;
      }
    }

    //connection right
    if (newAtom.freeElectrons > 0 && field.col < this.settings.columns - 1) {
      const rightAtom = this.board.fields[field.row][field.col + 1].atom;
      if (rightAtom && rightAtom.freeElectrons > 0) {
        rightAtom.connectedLeft = true;
        newAtom.connectedRight = true;
      }
    }

    //connection bottom
    if (newAtom.freeElectrons > 0 && field.row < this.settings.rows - 1) {
      const bottomAtom = this.board.fields[field.row + 1][field.col].atom;
      if (bottomAtom && bottomAtom.freeElectrons > 0) {
        bottomAtom.connectedTop = true;
        newAtom.connectedBottom = true;
      }
    }
    
    //connection left
    if (newAtom.freeElectrons > 0 && field.col > 0) {
      const leftAtom = this.board.fields[field.row][field.col - 1].atom;
      if (leftAtom && leftAtom.freeElectrons > 0) {
        leftAtom.connectedRight = true;
        newAtom.connectedLeft = true;
      }
    }

    return newAtom;
  }

  private gameOver() {
    clearInterval(this._timerID);
    this.board.disable();
    this.controls.gameOverLabel.style.display = 'block';
    this.controls.startButton.disabled = false;
    this.controls.pauseButton.disabled = true;
  }
}