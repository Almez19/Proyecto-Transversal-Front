import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home-component/home-component';
import { Page404 } from './components/page404/page404';
import { GimnasioViewComponent } from './components/gimnasio-view-component/gimnasio-view-component';
import { GimnasiosList } from './pages/gimnasios-list/gimnasios-list';
import { ReservasComponent } from './pages/reservas-component/reservas-component';
import { RutinasComponent } from './pages/rutinas-component/rutinas-component';
import { NoticiasComponent } from './pages/noticias-component/noticias-component';
import { PerfilComponent } from './pages/perfil-component/perfil-component';
import { authGuardGuard } from './guard/auth-guard-guard';
import { clienteGuard, staffGuard } from './guard/rol-guards';
import { LoginPage } from './pages/login-page/login-page';
import { GimnasioInfo } from './pages/gimnasio-info/gimnasio-info';
import { NoticiasInfo } from './pages/noticias-info/noticias-info';
import { CatalogoClases } from './pages/catalogo-clases/catalogo-clases';
import { ClaseDetalleComponent } from './pages/clase-detalle/clase-detalle';
import { RutinasCatalogoComponent } from './pages/rutinas-catalogo/rutinas-catalogo';
import { RutinaCrearComponent } from './pages/rutina-crear/rutina-crear';
import { RutinaDetalleComponent } from './pages/rutina-detalle/rutina-detalle';
import { RutinaCatalogoDetalleComponent } from './pages/rutina-catalogo-detalle/rutina-catalogo-detalle';
import { RutinaEjerciciosComponent } from './pages/rutina-ejercicios/rutina-ejercicios';
import { RutinaPersonalizadaDetalleComponent } from './pages/rutina-personalizada-detalle/rutina-personalizada-detalle';
import { PerfilRutinasComponent } from './pages/perfil-rutinas/perfil-rutinas';
import { PerfilGimnasiosComponent } from './pages/perfil-gimnasios/perfil-gimnasios';
import { PerfilSuscripcionComponent } from './pages/perfil-suscripcion/perfil-suscripcion';
import { MembresiasComponent } from './pages/membresias/membresias';
import { RegistroComponent } from './pages/registro/registro';
import { RecuperarContrasenaComponent } from './pages/recuperar-contrasena/recuperar-contrasena';
import { ClasesList } from './pages/clases-list/clases-list';
import { PerfilDatosComponent } from './pages/perfil-datos/perfil-datos';

export const routes: Routes = [

    {path:"home", pathMatch: "full", component: HomeComponent},
    {path:"", pathMatch: "full", redirectTo: "home"},
    {path:"gimnasios", pathMatch: "full", component: GimnasiosList},
    {path: "gimnasios/:id", pathMatch: "full", component: GimnasioInfo},
    // Clases: catálogo público (sin horarios)
    {path:"clases", pathMatch: "full", component: CatalogoClases},
    {path:"clases/:id", pathMatch: "full", component: ClaseDetalleComponent},

    // Rutinas
    {path:"rutinas", pathMatch: "full", component: RutinasCatalogoComponent},
    {path:"rutinas/catalogo/:id", pathMatch: "full", component: RutinaCatalogoDetalleComponent},
    {path:"rutinas/crear", pathMatch: "full", component: RutinaCrearComponent, canActivate: [clienteGuard]},
    {path:"rutinas/detalle/:id", pathMatch: "full", component: RutinaDetalleComponent, canActivate: [clienteGuard]},
    {path:"rutinas/ejercicios/:id", pathMatch: "full", component: RutinaEjerciciosComponent, canActivate: [clienteGuard]},
    {path:"rutinas/personalizada/:id", pathMatch: "full", component: RutinaPersonalizadaDetalleComponent, canActivate: [clienteGuard]},

    // Membresías
    {path:"membresias", pathMatch: "full", component: MembresiasComponent},
    {path:"noticias", pathMatch: "full", component: NoticiasComponent},
    {path:"noticias/:id", pathMatch: "full", component: NoticiasInfo},

    // Perfil (cliente)
    {path:"perfil", component: PerfilComponent, canActivate: [authGuardGuard], children: [
      {path: "", pathMatch: "full", redirectTo: "reservas"},
      {path: "reservas", component: ReservasComponent, canActivate: [clienteGuard]},
      {path: "rutinas", component: PerfilRutinasComponent, canActivate: [clienteGuard]},
      {path: "gimnasios", component: PerfilGimnasiosComponent, canActivate: [clienteGuard]},
      {path: "suscripcion", component: PerfilSuscripcionComponent, canActivate: [clienteGuard]},
      {path: "datos", component: PerfilDatosComponent, canActivate: [clienteGuard]}
    ]},

    // Gestión (staff)
    {path: "gestion/clases", pathMatch: "full", component: ClasesList, canActivate: [staffGuard]},
    {path: "gestion/reservas", pathMatch: "full", component: ReservasComponent, canActivate: [staffGuard]},
    {path: "gestion/rutinas", pathMatch: "full", component: RutinasComponent, canActivate: [staffGuard]},

    // Auth
    {path:"login", pathMatch: "full", component: LoginPage},
    {path:"registro", pathMatch: "full", component: RegistroComponent},
    {path:"recuperar-contrasena", pathMatch: "full", component: RecuperarContrasenaComponent},

    {path: "404", pathMatch: "full", component: Page404},
    {path:"**", redirectTo:"404" }, // Error 404, mantener siempre al final del array




];
