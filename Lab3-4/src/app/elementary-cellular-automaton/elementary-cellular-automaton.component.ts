import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-elementary-cellular-automaton',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './elementary-cellular-automaton.component.html',
  styleUrl: './elementary-cellular-automaton.component.scss'
})
export class ElementaryCellularAutomatonComponent {
  rule: number = 110;
  running = false;
  grid: number[][] = [];
  private intervalId: any;
  router: Router = inject(Router);
  constructor() {
    this.initializeGrid();
  }

  initializeGrid() {
    const rows = 25;
    const cols = 35;
    this.grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    this.grid[0][Math.floor(cols / 2)] = 1;//Задаём начальную живую клетку.
  }

  toggleSimulation() {
    this.running = !this.running;
    if (this.running) {
      this.intervalId = setInterval(() => this.updateGrid(), 500); //Момент времени = 500 миллисекунд;
    } else {
      clearInterval(this.intervalId);
    }
  }

  updateGrid() {
    for (let i = 1; i < this.grid.length; i++) {
      const newRow = Array(this.grid[i].length).fill(0);
      for (let j = 1; j < this.grid[i].length - 1; j++) {
        const left = this.grid[i - 1][j - 1];
        const center = this.grid[i - 1][j];
        const right = this.grid[i - 1][j + 1];
        const ruleIndex = (left << 2) | (center << 1) | right;
        newRow[j] = (this.rule >> ruleIndex) & 1;
      }
      this.grid[i] = [...newRow];
    }
  }

  toggleCell(row: number, col: number) {
    this.grid[row][col] = this.grid[row][col] ? 0 : 1;
  }

  goBack() {
    this.running = false;
    clearInterval(this.intervalId);
    this.initializeGrid();
    this.router.navigate(['/']);
  }
}