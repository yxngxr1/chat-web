import { Routes } from '@angular/router';
import { ChatPageComponent } from './components/chat-page/chat-page.component';
import { ChatDialogComponent } from './components/chat-dialog/chat-dialog.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { LoginGuard } from './guard/login.guard';

export const routes: Routes = [
    {
        path: '',
        component: ChatPageComponent,
        canActivate: [AuthGuard],
        children: [
          { path: 'chat/:id', component: ChatDialogComponent } // Чат
        ]
      },
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard]  },
    { path: '**', component: NotFoundComponent }
];
