import { Token } from "@stripe/stripe-js"

export interface Payment{
    Token : string
    amount : number
    appointmentId:string
}