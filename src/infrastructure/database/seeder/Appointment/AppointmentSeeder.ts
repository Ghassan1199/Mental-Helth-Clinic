import { connectToDatabase } from "../../index";
import { AppointmentRequest } from "../../../../domain/entities/AppointmentRequest";
import { Clinic } from "../../../../domain/entities/Clinic";
import { Appointment } from "../../../../domain/entities/Appointment";

export async function seedAppointment(users: any) {
  const client = await connectToDatabase();

  const appointments = [
    {
      date: new Date(),
      isCancelled: false, // Randomly assign cancellation status
      isCompleted: Math.random() < 0.5, // Randomly assign completion status
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0],
    },
    {
      date: new Date(),
      isCancelled: false, // Randomly assign cancellation status
      isCompleted: Math.random() < 0.5, // Randomly assign completion status
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0],
    },
    {
      date: new Date(),
      isCancelled: false, // Randomly assign cancellation status
      isCompleted: Math.random() < 0.5, // Randomly assign completion status
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0],
    },
    {
      date: new Date(),
      isCancelled: false, // Randomly assign cancellation status
      isCompleted: Math.random() < 0.5, // Randomly assign completion status
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0],
    },
    {
      date: new Date(),
      isCancelled: false, // Randomly assign cancellation status
      isCompleted: Math.random() < 0.5, // Randomly assign completion status
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0],
    },
    {
      date: new Date(),
      isCancelled: false, // Randomly assign cancellation status
      isCompleted: Math.random() < 0.5, // Randomly assign completion status
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0],
    },
    {
      date: new Date(),
      isCancelled: false, // Randomly assign cancellation status
      isCompleted: Math.random() < 0.5, // Randomly assign completion status
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0],
    },
    {
      date: new Date(),
      isCancelled: false, // Randomly assign cancellation status
      isCompleted: Math.random() < 0.5, // Randomly assign completion status
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0],
    },
    {
      date: new Date(),
      isCancelled: false, // Randomly assign cancellation status
      isCompleted: Math.random() < 0.5, // Randomly assign completion status
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0],
    },
    {
      date: new Date(),
      isCancelled: false, // Randomly assign cancellation status
      isCompleted: Math.random() < 0.5, // Randomly assign completion status
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0],
    },
    {
      date: new Date(),
      isCancelled: false, // Randomly assign cancellation status
      isCompleted: Math.random() < 0.5, // Randomly assign completion status
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0],
    },
    {
      date: new Date(),
      isCancelled: false, // Randomly assign cancellation status
      isCompleted: Math.random() < 0.5, // Randomly assign completion status
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0],
    },
    {
      date: new Date(),
      isCancelled: false, // Randomly assign cancellation status
      isCompleted: Math.random() < 0.5, // Randomly assign completion status
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0],
    },
    {
      date: new Date(),
      isCancelled: false, // Randomly assign cancellation status
      isCompleted: Math.random() < 0.5, // Randomly assign completion status
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0],
    },
    {
      date: new Date(),
      isCancelled: false, // Randomly assign cancellation status
      isCompleted: Math.random() < 0.5, // Randomly assign completion status
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0],
    },
  ];

    for (const appointment of appointments) {
        const newAppointment = client.getRepository(Appointment).create(appointment);
        await client.getRepository(Appointment).save(newAppointment);
  }

  return;
}
