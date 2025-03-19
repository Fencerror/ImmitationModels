import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, CommonModule],
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  menuItems = [               //Множество разделов с сылками на них.
    { 
      label: 'Элементарный клеточный автомат', 
      link: '/ELCEAU' 
    },
    { 
      label: 'Двумерный клеточный автомат', 
      link: '/DOCEAU' 
    },
  ];














}
