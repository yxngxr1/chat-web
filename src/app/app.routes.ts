import { Routes } from '@angular/router';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { ChatDialogComponent } from './chat-dialog/chat-dialog.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    { path: '', component: ChatPageComponent },
    { path: 'chat/:id', component: ChatPageComponent },
    { path: '**', component: NotFoundComponent }
];
