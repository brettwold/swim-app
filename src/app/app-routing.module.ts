import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'swimmer/add', loadChildren: './swimmer/add.module#AddPageModule' },
  { path: 'swimmer/edit', loadChildren: './swimmer/swimmer.module#SwimmerEditPageModule' },
  { path: 'times', loadChildren: './times/times.module#TimesPageModule' },
  { path: 'times/history/:race_type', loadChildren: './times/history.module#HistoryPageModule' },
  { path: 'records', loadChildren: './records/records.module#RecordsPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
