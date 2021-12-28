import { Field } from "./field.js";
export class Board {
    constructor(game) {
        this.fieldClick = (e) => {
            e.stopPropagation();
            const element = e.target;
            const row = Number.parseInt(element.dataset.row);
            const col = Number.parseInt(element.dataset.col);
            this.game.fieldClick(this.fields[row][col]);
        };
        this.game = game;
        this.fields = [];
        for (let row = 0; row < game.settings.rows; row++) {
            this.fields[row] = [];
            for (let col = 0; col < game.settings.columns; col++) {
                const field = new Field(row, col);
                this.fields[row][col] = field;
                field.element.addEventListener('click', this.fieldClick);
            }
        }
    }
    enable() {
        for (let row = 0; row < this.game.settings.rows; row++) {
            for (let col = 0; col < this.game.settings.columns; col++) {
                this.fields[row][col].element.addEventListener('click', this.fieldClick);
            }
        }
    }
    disable() {
        for (let row = 0; row < this.game.settings.rows; row++) {
            for (let col = 0; col < this.game.settings.columns; col++) {
                this.fields[row][col].element.removeEventListener('click', this.fieldClick);
            }
        }
    }
    clear() {
        for (let row = 0; row < this.game.settings.rows; row++) {
            for (let col = 0; col < this.game.settings.columns; col++) {
                this.fields[row][col].atom = null;
            }
        }
        this.disable();
        this.enable();
    }
}
