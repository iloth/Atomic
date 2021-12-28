import { Random } from "../helpers/random.js";
import { Atom } from "./atom.js";
import { Board } from "./board.js";
import { Controls } from "./controls.js";
import { Settings } from "./settings.js";
export class Game {
    constructor() {
        this.settings = new Settings();
        this.board = new Board(this);
        this.controls = new Controls(this);
        this.nextAtoms = [];
        this._level = 10;
        this._score = 0;
        this._molecules = 0;
    }
    get level() {
        return this._level;
    }
    set level(value) {
        this._level = value;
        this.controls.levelLabel.innerText = `${value}/${this.settings.maxLevel}`;
    }
    get score() {
        return this._score;
    }
    set score(value) {
        this._score = value;
        this.controls.scoreLabel.innerText = value.toString();
        if (this._level < this.settings.maxLevel) {
            this.level = 1 + Math.floor(this._score / this.settings.scorePerLevel);
        }
    }
    get molecules() {
        return this._molecules;
    }
    set molecules(value) {
        this._molecules = value;
        this.controls.moleculesLabel.innerText = value.toString();
    }
    set timeBar(value) {
        this.controls.timeBar.style.width = `${100 - value}%`;
        this.controls.timeBar.classList.remove('warning', 'danger');
        if (value > 70) {
            this.controls.timeBar.classList.add('danger');
        }
        else if (value > 50) {
            this.controls.timeBar.classList.add('warning');
        }
    }
    startClick() {
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
    pauseClick() {
        clearInterval(this._timerID);
        this.board.disable();
        this.controls.mainDiv.classList.add('paused');
        this.controls.pauseLabel.style.display = 'block';
    }
    continueClick() {
        this.startTimer();
        this.board.enable();
        this.controls.mainDiv.classList.remove('paused');
        this.controls.pauseLabel.style.display = 'none';
    }
    fieldClick(field) {
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
    startTimer() {
        this._timerID = setInterval(() => { this.timerTick(); }, 100);
    }
    timerTick() {
        const delay = (this.settings.maxLevel - this.level + 1) * this.settings.levelDelay;
        this._atomDropped += 100;
        if (this._atomDropped > delay) {
            this.addNext();
        }
        else {
            const timePercent = Math.floor(this._atomDropped * 100 / delay);
            this.timeBar = timePercent;
        }
    }
    addNext() {
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
        }
        else {
            this.timeBar = 100;
            this.gameOver();
            this.controls.startButton.disabled = false;
        }
    }
    removeNext(nextAtom) {
        nextAtom.element.classList.add('destructing');
        nextAtom.element.addEventListener('transitionend', (e) => {
            nextAtom.element.remove();
        });
    }
    checkMolecule(startField) {
        const stack = [startField];
        const found = [startField];
        const checkField = (field) => {
            if (field.atom.freeElectrons > 0) {
                return true;
            }
            else if (!found.some((f) => f.row === field.row && f.col === field.col)) {
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
            }
            else if (field.atom.connectedTop && checkField(this.board.fields[field.row - 1][field.col])) {
                return null;
            }
            else if (field.atom.connectedRight && checkField(this.board.fields[field.row][field.col + 1])) {
                return null;
            }
            else if (field.atom.connectedBottom && checkField(this.board.fields[field.row + 1][field.col])) {
                return null;
            }
            else if (field.atom.connectedLeft && checkField(this.board.fields[field.row][field.col - 1])) {
                return null;
            }
        }
        return found;
    }
    removeMolecule(fields) {
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
    getNewAtom(next, field) {
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
    gameOver() {
        clearInterval(this._timerID);
        this.board.disable();
        this.controls.gameOverLabel.style.display = 'block';
        this.controls.startButton.disabled = false;
        this.controls.pauseButton.disabled = true;
    }
}
