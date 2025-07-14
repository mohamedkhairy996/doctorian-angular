import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AddAppointmentComponent } from './components/add-appointment/add-appointment.component';
import { EditAppointmnetComponent } from './components/edit-appointmnet/edit-appointmnet.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PaymentsComponent } from './components/payments/payments.component';

export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:"full"},
    {path:"home",component:HomeComponent},
    {path:"about",component:AboutUsComponent},
    {path:"appointments" , component:AppointmentsComponent},
    { path: "addappointment/:patId/:docId", component: AddAppointmentComponent },
    { path: "addappointment", component: AddAppointmentComponent },
    {path:"editAppointment/:id" , component:EditAppointmnetComponent},
    {path:"login" , component:LoginComponent},
    {path:"register" , component:RegisterComponent},
    {path:"pay/:id" , component:PaymentsComponent},
    {path:"**",component:NotFoundComponent},
];
