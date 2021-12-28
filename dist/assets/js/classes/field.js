export class Field {
    constructor(row, col) {
        this._atom = null;
        this.row = row;
        this.col = col;
        this.element = document.querySelector(`.field[data-row="${row}"][data-col="${col}"]`);
    }
    get atom() {
        return this._atom;
    }
    set atom(value) {
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
