import { ElementHelper } from "../helpers/element.js";
export class Atom {
    constructor(protons) {
        this._connectedTop = false;
        this._connectedRight = false;
        this._connectedBottom = false;
        this._connectedLeft = false;
        this.protons = protons;
        this.setElement();
    }
    get freeElectrons() {
        const connections = (this._connectedTop ? 1 : 0) +
            (this._connectedRight ? 1 : 0) +
            (this._connectedBottom ? 1 : 0) +
            (this._connectedLeft ? 1 : 0);
        return this.protons - connections;
    }
    get connectedTop() {
        return this._connectedTop;
    }
    set connectedTop(value) {
        if (this.freeElectrons === 0 && value && !this._connectedTop) {
            throw new Error('No more free electron!');
        }
        else {
            this.element.classList.remove(`free--${this.freeElectrons}`);
            this._connectedTop = value;
            if (value) {
                this._element.classList.add('connected--t');
            }
            else {
                this._element.classList.remove('connected--t');
            }
            this.element.classList.add(`free--${this.freeElectrons}`);
        }
    }
    get connectedRight() {
        return this._connectedRight;
    }
    set connectedRight(value) {
        if (this.freeElectrons === 0 && value && !this._connectedRight) {
            throw new Error('No more free electron!');
        }
        else {
            this.element.classList.remove(`free--${this.freeElectrons}`);
            this._connectedRight = value;
            if (value) {
                this._element.classList.add('connected--r');
            }
            else {
                this._element.classList.remove('connected--r');
            }
            this.element.classList.add(`free--${this.freeElectrons}`);
        }
    }
    get connectedBottom() {
        return this._connectedBottom;
    }
    set connectedBottom(value) {
        if (this.freeElectrons === 0 && value && !this._connectedBottom) {
            throw new Error('No more free electron!');
        }
        else {
            this.element.classList.remove(`free--${this.freeElectrons}`);
            this._connectedBottom = value;
            if (value) {
                this._element.classList.add('connected--b');
            }
            else {
                this._element.classList.remove('connected--b');
            }
            this.element.classList.add(`free--${this.freeElectrons}`);
        }
    }
    get connectedLeft() {
        return this._connectedLeft;
    }
    set connectedLeft(value) {
        if (this.freeElectrons === 0 && value && !this._connectedLeft) {
            throw new Error('No more free electron!');
        }
        else {
            this.element.classList.remove(`free--${this.freeElectrons}`);
            this._connectedLeft = value;
            if (value) {
                this._element.classList.add('connected--l');
            }
            else {
                this._element.classList.remove('connected--l');
            }
            this.element.classList.add(`free--${this.freeElectrons}`);
        }
    }
    setElement() {
        const classes = ['atom', `atom--${this.protons}`, `free--${this.freeElectrons}`];
        if (this._connectedTop)
            classes.push('connected--t');
        if (this._connectedRight)
            classes.push('connected--r');
        if (this._connectedBottom)
            classes.push('connected--b');
        if (this._connectedLeft)
            classes.push('connected--l');
        this._element = ElementHelper.Create('div', { id: null, classList: classes }, ElementHelper.Create('div', { id: null, classList: ['nucleus'] }), ElementHelper.Create('div', { id: null, classList: ['electrons'] }, ElementHelper.Create('div', { id: null, classList: ['electron', 'electron--1'] }), ElementHelper.Create('div', { id: null, classList: ['electron', 'electron--2'] }), ElementHelper.Create('div', { id: null, classList: ['electron', 'electron--3'] }), ElementHelper.Create('div', { id: null, classList: ['electron', 'electron--4'] })), ElementHelper.Create('div', { id: null, classList: ['connections'] }, ElementHelper.Create('div', { id: null, classList: ['connection', 'connection--t'] }), ElementHelper.Create('div', { id: null, classList: ['connection', 'connection--r'] }), ElementHelper.Create('div', { id: null, classList: ['connection', 'connection--b'] }), ElementHelper.Create('div', { id: null, classList: ['connection', 'connection--l'] })));
    }
    get element() {
        return this._element;
    }
    clone() {
        const atom = new Atom(this.protons);
        atom.connectedTop = this._connectedTop;
        atom.connectedRight = this._connectedRight;
        atom.connectedBottom = this._connectedBottom;
        atom.connectedLeft = this._connectedLeft;
        return atom;
    }
}
