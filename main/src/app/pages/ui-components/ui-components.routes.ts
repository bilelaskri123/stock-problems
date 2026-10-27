import { Routes } from '@angular/router';

// ui
import { AppUploadModemComponent } from './upload-modem/upload-modem.component';
import { AppStockProblemsComponent } from './stock-problems/stock-problems.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { AppFormsComponent } from './forms/forms.component';
import { AppTablesComponent } from './tables/tables.component';
import { AppDetailsComponent } from './details/details.component';
import { AppFreeDesignation } from './free-designation/free-designation';
import { AppReservedDesignation } from './reservd-designation/reserved-designation';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'details',
        component: AppDetailsComponent,
      },
      {
        path: 'upload-modem',
        component: AppUploadModemComponent,
      },
      {
        path: 'problems',
        component: AppStockProblemsComponent,
      },
      {
        path: 'free-designation',
        component: AppFreeDesignation,
      },
      {
        path: 'reserved-designation',
        component: AppReservedDesignation,
      },
      // {
      //   path: 'lists',
      //   component: AppListsComponent,
      // },
      // {
      //   path: 'menu',
      //   component: AppMenuComponent,
      // },
      // {
      //   path: 'tooltips',
      //   component: AppTooltipsComponent,
      // },
      // {
      //   path: 'forms',
      //   component: AppFormsComponent,
      // },
      // {
      //   path: 'tables',
      //   component: AppTablesComponent,
      // },
    ],
  },
];
