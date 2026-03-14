import { RenderMode, ServerRoute } from '@angular/ssr';
import { TEMPLATES } from './data/templates.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'dashboard/templates/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      TEMPLATES.map((t) => ({ id: t.id })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
