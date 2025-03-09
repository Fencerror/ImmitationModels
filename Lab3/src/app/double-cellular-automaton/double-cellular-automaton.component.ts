import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-double-cellular-automaton',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './double-cellular-automaton.component.html',
  styleUrl: './double-cellular-automaton.component.scss'
})
export class DoubleCellularAutomatonComponent {
  rule: number = 110;
  running = false;
  grid: number[][] = [];
  private intervalId: any;

  constructor() {
    this.initializeGrid();
  }

  initializeGrid() {
    const size = 25;
    this.grid = Array.from({ length: size }, () => Array(size).fill(0));
    this.grid[Math.floor(size / 2)][Math.floor(size / 2)] = 1;
  }

  toggleSimulation() {
    this.running = !this.running;
    if (this.running) {
      this.intervalId = setInterval(() => this.updateGrid(), 500);
    } else {
      clearInterval(this.intervalId);
    }
  }

  updateGrid() {
    const newGrid = this.grid.map(row => [...row]);
    for (let i = 1; i < this.grid.length - 1; i++) {
      for (let j = 1; j < this.grid[i].length - 1; j++) {
        const left = this.grid[i][j - 1];
        const center = this.grid[i][j];
        const right = this.grid[i][j + 1];
        const top = this.grid[i - 1][j];
        const bottom = this.grid[i + 1][j];

        const ruleIndex = (left << 4) | (center << 3) | (right << 2) | (top << 1) | bottom;
        newGrid[i][j] = (this.rule >> ruleIndex) & 1;
      }
    }
    this.grid = newGrid;
  }

  toggleCell(row: number, col: number) {
    this.grid[row][col] = this.grid[row][col] ? 0 : 1;
  }
}
