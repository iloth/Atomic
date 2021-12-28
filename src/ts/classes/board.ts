import { Field } from "./field.js";
import { Game } from "./game.js";

export class Board {
  constructor(game: Game) {
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

  private fieldClick: EventListener = (e: MouseEvent) => {
    e.stopPropagation();

    const element = <HTMLElement>e.target;
    const row = Number.parseInt(element.dataset.row);
    const col = Number.parseInt(element.dataset.col);

    this.game.fieldClick(this.fields[row][col]);
  };
  
  public readonly game: Game;
  public readonly fields: Field[][];

  public enable() {
    for (let row = 0; row < this.game.settings.rows; row++) {
      for (let col = 0; col < this.game.settings.columns; col++) {
        this.fields[row][col].element.addEventListener('click', this.fieldClick);
      }
    }
  }


  public disable() {
    for (let row = 0; row < this.game.settings.rows; row++) {
      for (let col = 0; col < this.game.settings.columns; col++) {
        this.fields[row][col].element.removeEventListener('click', this.fieldClick);
      }
    }
  }

  public clear() {
    for (let row = 0; row < this.game.settings.rows; row++) {
      for (let col = 0; col < this.game.settings.columns; col++) {
        this.fields[row][col].atom = null;
      }
    }
    this.disable();
    this.enable();
  }
}
