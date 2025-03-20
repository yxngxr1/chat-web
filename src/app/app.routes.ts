import { Routes } from '@angular/router';
import { ChatPageComponent } from './components/chat-page/chat-page.component';
import { ChatDialogComponent } from './components/chat-dialog/chat-dialog.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: '', component: ChatPageComponent, canActivate: [AuthGuard] },
    { path: 'chat/:id', component: ChatPageComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: '**', component: NotFoundComponent }
];
