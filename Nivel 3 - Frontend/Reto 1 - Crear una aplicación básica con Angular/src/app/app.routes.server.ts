import { RenderMode, ServerRoute } from '@angular/ssr';
import { RouterModule, Routes } from '@angular/router';


export const serverRoutes: ServerRoute[] = [
  {
    path: 'lista-elementos',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
