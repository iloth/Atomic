export class Controls {
    constructor(game) {
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
    startClick(e) {
        e.stopPropagation();
        this._game.startClick();
    }
    pauseClick(e) {
        e.stopPropagation();
        if (this.pauseButton.textContent === 'Pause') {
            this.pauseButton.textContent = 'Continue';
            this._game.pauseClick();
        }
        else {
            this.pauseButton.textContent = 'Pause';
            this._game.continueClick();
        }
    }
}
