import { Game } from "./game.js";

export class Controls{
  constructor(game: Game) {
    this._game = game;

    this.mainDiv = document.querySelector('.main');

    this.levelLabel = document.querySelector('.controls .screen .scores .level span');
    this.scoreLabel = document.querySelector('.controls .screen .scores .score span');
    this.moleculesLabel = document.querySelector('.controls .screen .scores .molecules span');
    
    this.timeBar = document.querySelector('.controls .screen .timer .bar');

    this.startButton = document.querySelector('.controls .buttons .button.start');
    this.startButton.addEventListener('click', (e) => { this.startClick(e); });
    this.pauseButton = document.querySelector('.controls .buttons .button.pause');
    this.pauseButton.addEventListener('click', (e) => { this.pauseClick(e); });
    
    this.gameOverLabel = document.querySelector('.message.gameover');
    this.pauseLabel = document.querySelector('.message.pause');

  }

  private readonly _game: Game;

  public readonly mainDiv: HTMLElement;

  public readonly levelLabel: HTMLElement;
  public readonly scoreLabel: HTMLElement;
  public readonly moleculesLabel: HTMLElement;
  
  public readonly timeBar: HTMLElement;

  public readonly startButton: HTMLButtonElement;
  public readonly pauseButton: HTMLButtonElement;
  
  public readonly gameOverLabel: HTMLElement;
  public readonly pauseLabel: HTMLElement;


  private startClick(e: MouseEvent) {
    e.stopPropagation();
    this._game.startClick();
  }

  private pauseClick(e: MouseEvent) {
    e.stopPropagation();
    if (this.pauseButton.textContent === 'Pause') {
      this.pauseButton.textContent = 'Continue';
      this._game.pauseClick();
    } else {
      this.pauseButton.textContent = 'Pause';
      this._game.continueClick();
    }
  }
}