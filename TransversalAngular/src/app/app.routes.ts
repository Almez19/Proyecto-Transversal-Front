import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home-component/home-component';
import { Page404 } from './components/page404/page404';
import { GimnasioViewComponent } from './components/gimnasio-view-component/gimnasio-view-component';
import { GimnasiosList } from './pages/gimnasios-list/gimnasios-list';
import { ReservasComponent } from './pages/reservas-component/reservas-component';
import { RutinasComponent } from './pages/rutinas-component/rutinas-component';
import { NoticiasComponent } from './pages/noticias-component/noticias-component';
import { PerfilComponent } from './pages/perfil-component/perfil-component';

export const routes: Routes = [

    {path:"home", pathMatch: "full", component: HomeComponent},
    {path:"", pathMatch: "full", redirectTo: "home"},
    {path:"gimnasios", pathMatch: "full", component: GimnasiosList},
    {path:"reservas", pathMatch: "full", component: ReservasComponent},
    {path:"rutinas", pathMatch: "full", component: RutinasComponent},
    {path:"noticias", pathMatch: "full", component: NoticiasComponent},
    {path:"perfil", pathMatch: "full", component: PerfilComponent},
    {path: "404", pathMatch: "full", component: Page404},
    {path:"**", redirectTo:"404" }, // Error 404, mantener siempre al final del array




];
