import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  constructor() {}
  columns = 30;
  rows = 30;
  board: boolean[][];
  generation: number;
  avaliableDelays = [300, 600, 900, 1200, 1500];
  delay = 2;
  cycling = false;
  validInputs = true;
  timeout: NodeJS.Timeout;
  ngOnInit(): void {
    this.generateBoard();
  }
  generateBoard() {
    clearTimeout(this.timeout);
    this.generation = 0;
    this.board = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.columns }, () => false)
    );
  }
  changeBoard(rowsInput: HTMLInputElement, columnsInput: HTMLInputElement) {
    if (rowsInput.checkValidity() && columnsInput.checkValidity()) {
      this.validInputs = true;
      this.rows = +rowsInput.value;
      this.columns = +columnsInput.value;
      this.generateBoard();
    } else this.validInputs = false;
  }
  onCellClicked(a: number, b: number) {
    this.board[a][b] = !this.board[a][b];
  }
  setGameboardStyles() {
    let styles = {
      'grid-template-columns': `repeat(${this.columns}, 16px)`,
    };
    return styles;
  }
  checkNeighborhood(a: number, b: number): number {
    let livingNeighbours = 0;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        let newX = a + x;
        let newY = b + y;
        if (newX >= 0 && newX < this.rows && newY >= 0 && newY < this.columns) {
          livingNeighbours += this.board[newX][newY] ? 1 : 0;
        }
      }
    }
    livingNeighbours -= this.board[a][b] ? 1 : 0;
    return livingNeighbours;
  }
  lifeCycle() {
    let boardClone = this.board.map(function (arr) {
      return arr.slice();
    });
    for (let i = 0; i < this.board.length; i++) {
      for (let k = 0; k < this.board.length; k++) {
        let aliveNeighbours = this.checkNeighborhood(i, k);
        if (this.board[i][k] && aliveNeighbours != 3 && aliveNeighbours != 2)
          boardClone[i][k] = false;
        if (!this.board[i][k] && aliveNeighbours == 3) boardClone[i][k] = true;
      }
    }
    this.board = boardClone.map(function (arr) {
      return arr.slice();
    });
    this.generation++;
    if (this.cycling)
      this.timeout = setTimeout(
        () => this.lifeCycle(),
        this.avaliableDelays[this.delay]
      );
  }
  startLifeCycle() {
    if (!this.cycling) {
      this.cycling = true;
      this.lifeCycle();
    }
  }
  stopLifeCycle() {
    this.cycling = false;
    clearTimeout(this.timeout);
  }
  speedUpLifeCycle() {
    if (this.delay > 0) this.delay--;
  }
  slowDownLifeCycle() {
    if (this.delay < this.avaliableDelays.length - 1) this.delay++;
  }
}
