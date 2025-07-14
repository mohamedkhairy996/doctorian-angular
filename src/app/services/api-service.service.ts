import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Appointment } from '../models/Iappointment';
import { Doctor } from '../models/Idoctor';
import { Patient } from '../models/Ipatient';
import { environment } from '../../environments/environment.development';
import { Iregister } from '../models/iregister';
import { props, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { IUser } from '../models/iuser';
import { setUserId } from '../store/UserId/id.action';
import { AddAppointment } from '../models/IaddAppointment';
import { Payment } from '../models/Ipayment';
import { Token } from './../../../node_modules/@stripe/stripe-js/dist/api/tokens.d';
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
patients:Patient[] = [] as Patient[];
doctors:Doctor[] = [] as Doctor[];
appointments:Appointment[] = [] as Appointment[];
id:IUser={} as IUser 
private userNameSubject = new BehaviorSubject<string | null>(null);
userName$ = this.userNameSubject.asObservable();


constructor(private _httpClient : HttpClient ,
            private _store : Store<{userId: string}>
) {

  this.getLoggedInUserId().subscribe({
    next:(id)=>{
      this._store.dispatch(setUserId({ userId: id}));
    }
  })
  
  // Fetch patients
  this.getPatients().subscribe({
    next:(pats)=>{this.patients = pats;},
    error:(err)=>{console.error('Error fetching patients:', err);}
  });
 
  // Fetch doctors
  this.getDoctors().subscribe({
    next:(docs)=>{this.doctors = docs;},
    error:(err)=>{console.error('Error fetching doctors:', err);}
  });

  // Fetch appointments
  this.getAppointments().subscribe({
    next:(apps)=>{this.appointments = apps;},
    error:(err)=>{console.error('Error fetching appointments:', err);}
  });
 }

  

  async setUserId()
  {
    this.id = await firstValueFrom(this.getLoggedInUserId())
    // Store the user ID in the store
    this._store.dispatch(setUserId({userId:this.id}));
    // return this.id;
  }
  //////////////////////////////////////////////////////////////////////////
  // CRUD operations for appointments, doctors, and patients and users
  //////////////////////////////////////////////////////////////////////////

  // CRUD operations for users
  getLoggedInUserId()
  {
    return this._httpClient.get<IUser>(`${environment.baseUrl}/user/getSignedInUser`, {
    withCredentials: true
  });
  }
  getUsers()
  {
    return this._httpClient.get<Iregister[]>(`${environment.baseUrl}/user`);
  }
  setUser(user:Iregister)
  {
    return this._httpClient.post(`${environment.baseUrl}/User`, user,{
      withCredentials: true
});
  }
  getUserById(id:string)
  {
    return this._httpClient.get<Iregister>(`${environment.baseUrl}/user?id=${id}`);
  }
  deleteUser(id:string)
  {
    return this._httpClient.delete(`${environment.baseUrl}/user/${id}`);
  }
  isUserSiginIn(id : string)
  {
    return this._httpClient.get<boolean>(`${environment.baseUrl}/User/issignedin/${id}`);
  }
  setUserSiginIn(usernameOrEmail: string, password : string)
  {
    let Email = usernameOrEmail;
    if (!usernameOrEmail.includes('@')) 
      {
      // If it doesn't contain '@', treat it as a username
      let UserName = usernameOrEmail;
      return this._httpClient.post(`${environment.baseUrl}/User/signin`, { UserName, password },{
      withCredentials: true }); 
   
    }else
    {
    return this._httpClient.post(`${environment.baseUrl}/User/signin`, { Email, password},{
    withCredentials: true }); 
    }
    
  }
  SignOut()
  {
    return this._httpClient.post(`${environment.baseUrl}/User/signout`,{}, {
    withCredentials: true});
  }



  
  getAppointments()
  {
    return this._httpClient.get<Appointment[]>(`${environment.baseUrl}/appointments`);
  }
  addAppointment(Appointment:AddAppointment)
  {
    return this._httpClient.post(`${environment.baseUrl}/appointments`, Appointment);
  }
  getAppointmentById(id:string)
  {
    return this._httpClient.get<Appointment>(`${environment.baseUrl}/appointments/id?id=${id}`);
  }
  getAppointmentByPatientId(id:string)
  {
    return this._httpClient.get<Appointment[]>(`${environment.baseUrl}/appointments/patId?patientId=${id}`);
  }
  getAppointmentByDoctorId(id:string)
  {
    return this._httpClient.get<Appointment[]>(`${environment.baseUrl}/appointments/docId?doctorId=${id}`);
  }
  updateAppointment(Appointment:Appointment)
  {
    return this._httpClient.put(`${environment.baseUrl}/Appointments?id=${Appointment.id}`, Appointment);
  }
  deleteAppointment(id:string)
  {
    return this._httpClient.delete(`${environment.baseUrl}/Appointments/${id}`);
  }

  //////////////////////////////////////////////////////////////////////////

  getDoctors()
  {
    return this._httpClient.get<Doctor[]>(`${environment.baseUrl}/doctors`);
  }
  getDoctorById(id:string)
  {
    return this._httpClient.get<Doctor>(`${environment.baseUrl}/doctors/${id}`);
  }

  getPatients()
  {
    return this._httpClient.get<Patient[]>(`${environment.baseUrl}/patients`);
  }
  getPatientById(id:string)
  {
    return this._httpClient.get<Patient>(`${environment.baseUrl}/patients/${id}`);
  }



  getPayment()
  {
    return this._httpClient.get(`${environment.baseUrl}/stripe`
);
  }
  postPayment(pay:Payment)
  {
    return this._httpClient.post(`${environment.baseUrl}/stripe`,pay
);
  }

  addPayment(pay:Payment)
  {
        return this._httpClient.post(`${environment.baseUrl}/stripe`, pay,{
  withCredentials: true
});
  }
}

