import { Routes } from '@angular/router';
import { ElementaryCellularAutomatonComponent } from './elementary-cellular-automaton/elementary-cellular-automaton.component';
import { DoubleCellularAutomatonComponent } from './double-cellular-automaton/double-cellular-automaton.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {path: '', component: LayoutComponent},
  {path:'ELCEAU', component: ElementaryCellularAutomatonComponent},
  {path: 'DOCEAU', component: DoubleCellularAutomatonComponent },
  {path: '**', redirectTo: ''}
];
