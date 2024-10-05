'use client'

import React  from 'react'
import   {useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button'
import { Appointment } from '@/types/mongoDB.types'
import AppointmentForm from './forms/AppointmentForm'

const AppointmentModal = ({
  type,
  patientId,
  userId,
  appointment, 

} : {
  type: 'schedule' | 'cancel',
  patientId: string,
  userId: string,
  appointment?: Appointment 

})=> {
  const [open,setOpen] = useState(false)
  return (
      <Dialog open = {open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
    <Button variant="ghost" className={`capitalize ${type === 'schedule' && 
      'text-green-500'}`}>
        {type}
      </Button>
    </DialogTrigger>
    <DialogContent className='shad-dialog sm:max-w-md'>
      <DialogHeader className='mb-4 space-y-3'>
        <DialogTitle className='capitalize'>{type}</DialogTitle>
        <DialogDescription>
          Please fill the following detail to {type} an appointment
        </DialogDescription>
      </DialogHeader>
      <AppointmentForm
        userId={userId}
        type={type}
        setOpen={setOpen}
        appointment={appointment}
      />
    </DialogContent>
  </Dialog>
  )

}

export default AppointmentModal