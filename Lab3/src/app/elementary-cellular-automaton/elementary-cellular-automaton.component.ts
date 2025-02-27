import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-elementary-cellular-automaton',
  imports: [CommonModule, FormsModule],
  templateUrl: './elementary-cellular-automaton.component.html',
  styleUrl: './elementary-cellular-automaton.component.scss'
})
export class ElementaryCellularAutomatonComponent {
  rule: number = 110;
  running = false;
  grid: number[][] = [];
  private intervalId: any;

  constructor() {
    this.initializeGrid();
  }

  initializeGrid() {
    this.grid = Array.from({ length: 25 }, () => Array(35).fill(0));
    this.grid[0][Math.floor(this.grid[0].length / 2)] = 1;
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
    const newRow = Array(this.grid[0].length).fill(0);
    for (let i = 1; i < this.grid.length; i++) {
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
}
