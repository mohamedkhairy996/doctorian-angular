import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { NgxStripeModule, StripeCardComponent, StripeService } from 'ngx-stripe';
import { ApiServiceService } from '../../services/api-service.service';
import { Payment } from '../../models/Ipayment';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { environment } from '../../../environments/environment.development';
import { Appointment } from '../../models/Iappointment';
import { ActivatedRoute, Router } from '@angular/router';
import { setAppointment } from '../../store/appointment/app.action';

@Component({
  selector: 'app-payments',
  imports: [
  CommonModule,
    ReactiveFormsModule,
    NgxStripeModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
stripeService = inject(StripeService);
name :string = ""
appointment : Appointment = {} as Appointment
checkoutForm: FormGroup = {} as FormGroup ;
id:string |null= ''
  fb = inject(FormBuilder);
  request : Payment = {} as Payment
@ViewChild(StripeCardComponent) card!: StripeCardComponent;

  
cardOptions: StripeCardElementOptions = {
  style: {
    base: {
      iconColor: '#666EE8',
      color: '#31325F',
      fontWeight: '400',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      iconColor: '#e85746',
      color: '#e85746'
    }
  }
};
 elementsOptions: StripeElementsOptions = {
  locale: 'en'
};

  constructor(private _ApiService:ApiServiceService , private _store : Store<any> , private _router : Router , private _activeRoute:ActivatedRoute)
  { this.id = this._activeRoute.snapshot.paramMap.get('id');
      this._store.select("userId").subscribe({
        next:(user)=>{this.name = user.name;
        this.checkoutForm = this.fb.group({
         name: [this.name, [Validators.required]],
         email:[user.email,[Validators.required]],
         appointmentId:[this.id,Validators.required]
           });
        // this.checkoutForm.get("appointmentId")?.setValue(app.id);

        },
        error:(err)=>{console.log("Error :"+err);}
      })
      this._store.select("appointment").subscribe({
        next:(app)=>{
          this.appointment = app;
        }
      })
  }

pay() {
    const name = this.checkoutForm.get('name')?.value;
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          this.request.amount = environment.appointmentCost;
          this.request.Token = result.token.id ;
          this.request.appointmentId = this.id!;
          console.log(this.appointment);
          console.log(this.request);
         this._ApiService.addPayment(this.request).subscribe({
          next:(val)=>{
                      Swal.fire({
                                title: "Good job!",
                                text: "Payment Success and Appointment Status"+this.appointment.status+"---"+val,
                                icon: "success"
                              });
                              this._router.navigateByUrl("/appointments")
              }
              
          
          ,error:(err)=>{
            Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: err.message+this.request
                    });
                    console.log(err)
          }
         })
          // Send token to backend
        } else if (result.error) {
          Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong!" + result.error.message
                });
                        }
      });
  }
get()
{
  let pay = {} as Payment;
  pay.amount=5000;
  this._ApiService.postPayment(pay).subscribe({
    next:(data)=>{Swal.fire({
       title: "Good job!",
                      text: "Payment Success "+data,
                      icon: "success"
                    
    })
  console.log(data);}
  })
}



}
