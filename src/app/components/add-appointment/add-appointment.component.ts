import { Component, inject, OnInit } from '@angular/core';
import { Patient } from '../../models/Ipatient';
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, NgSelectOption, ReactiveFormsModule, Validators, ɵNgSelectMultipleOption } from '@angular/forms';
import { Doctor } from '../../models/Idoctor';
import { ActivatedRoute, Router } from '@angular/router';
import  swal  from "sweetalert2"
import { AddAppointment } from '../../models/IaddAppointment';
import { Store } from '@ngrx/store';
import { setAppointment } from '../../store/appointment/app.action';
import { Appointment } from '../../models/Iappointment';
import { IUser } from '../../models/iuser';
import { firstValueFrom } from 'rxjs';
import { dateNotBeforeToday } from '../../validators/dateValidator';
@Component({
  selector: 'app-add-appointment',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.css'
})
export class AddAppointmentComponent implements OnInit {
patients:Patient[] = [] as Patient[];
doctors:Doctor[] = [] as Doctor[];
Patient : Patient = {} as Patient
Doctor : Doctor = {} as Doctor
user : IUser = {} as IUser
formData :FormGroup 
patientId : string | null =''
doctorId : string | null =''
constructor(private _apiService:ApiServiceService , 
  private _router:Router,
  private _store :Store<any>,
  private route: ActivatedRoute

) {
  this._store.select("userId").subscribe({
    next:(user)=>this.user = user
  })
  this._apiService.getPatients().subscribe({
    next:(pats)=>{this.patients = pats;},
    error:(err)=>{console.error('Error fetching patients:', err);}
  });
this._apiService.getDoctors().subscribe({
    next:(docs)=>{this.doctors = docs;},
    error:(err)=>{console.error('Error fetching patients:', err);}
  });
  


  this.formData = new FormGroup({
    patientId: new FormControl(0,[Validators.required,this.zeroValueValidator]),
    doctorId: new FormControl(0,[Validators.required,this.zeroValueValidator]),
    day: new FormControl('',[Validators.required,dateNotBeforeToday]),
  });

}
zeroValueValidator(control: AbstractControl) {
  return control.value === '0' ? { invalid: true } : null;
}




  async ngOnInit(): Promise<void> {
  this.patientId = this.route.snapshot.paramMap.get('patId');
  this.doctorId = this.route.snapshot.paramMap.get('docId');
  this.Doctor = await firstValueFrom(this._apiService.getDoctorById(this.doctorId!));
  this.Patient = await firstValueFrom(this._apiService.getPatientById(this.patientId!));
  }

  get patient()
  {
    return this.formData.get("patientId");
  }
  get doctor()
  {
    return this.formData.get("doctorId");
  }
  get day()
  {
    return this.formData.get("day");
  }

  onSubmit()
  {
    console.log(this.formData.value);
    let data = this.formData.value as AddAppointment
    this._apiService.addAppointment(data).subscribe({
      next:(app)=>{console.log('Appointment added successfully:', app);
        swal.fire({
                  icon: 'success',
                  title: 'Appointment Assigned Successfully',
                });
                this._store.dispatch(setAppointment({appointment:app as Appointment}))
        // Optionally, navigate to another page or show a success message
        let appointment = app as Appointment
        this._router.navigate(['/editAppointment/'+appointment.id]);
      },
      error:(err)=>{console.error('Error adding appointment:', err);
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error adding appointment: ' + err
        });
      }
    });
  }

  onSubmitUser()
  {
    let data = {doctorId:this.doctorId,patientId:this.patientId,day:this.formData.get('day')?.value} as AddAppointment
    console.log(data);
    this._apiService.addAppointment(data).subscribe({
      next:(app)=>{console.log('Appointment added successfully:', app);
        swal.fire({
                  icon: 'success',
                  title: 'Appointment Assigned Successfully',
                });
                this._store.dispatch(setAppointment({appointment:app as Appointment}))
        // Optionally, navigate to another page or show a success message
        let appointment = app as Appointment
        this._router.navigate(['/editAppointment/'+appointment.id]);
      },
      error:(err)=>{console.error('Error adding appointment:', err);
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error adding appointment: ' + err
        });
      }
    });
  }
}
