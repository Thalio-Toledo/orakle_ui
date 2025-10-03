import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OwnerComponent } from './owner/owner.component';
import { ProfileComponent } from './profile/profile.component';
import { OwnerGuardService } from './services/owner-guard.service';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'thalio-toledo',
        pathMatch: 'full'
    },
    {
        path:'owner',
        component: OwnerComponent,
        canActivate:[OwnerGuardService]
    },
    {
        path:'thalio-toledo',
        component: ProfileComponent
    },
    {
        path:'login',
        component: LoginComponent
    },
];
