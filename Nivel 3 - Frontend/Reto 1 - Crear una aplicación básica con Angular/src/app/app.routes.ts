import { Routes } from '@angular/router';
import { Inicio } from './inicio';
import { ListaElementos } from './lista-elementos/lista-elementos';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: Inicio,
	},
	{
		path: 'lista-elementos',
		component: ListaElementos,
	},
];
