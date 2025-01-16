import { connectToDatabase } from "../../index";
import { AppointmentRequest } from "../../../../domain/entities/AppointmentRequest";

export async function seedAppointmentRequest(users: any) {
    const client = await connectToDatabase();

  const requests = [
    {
      status: true, // Randomly assign status
      description: `Appointment request description `,
      proposedDate: new Date(),
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0], // Assuming users[0] exists,
    },
    {
      status: true, // Randomly assign status
      description: `Appointment request description `,
      proposedDate: new Date(),
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0], // Assuming users[0] exists,
    },
    {
      description: `Appointment request description `,
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0], // Assuming users[0] exists,
    },
    {
      description: `Appointment request description `,
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0], // Assuming users[0] exists,
    },
    {
      status: true, // Randomly assign status
      description: `Appointment request description `,
      proposedDate: new Date(),
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0], // Assuming users[0] exists,
    },
    {
      status: true, // Randomly assign status
      description: `Appointment request description `,
      proposedDate: new Date(),
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0], // Assuming users[0] exists,
    },
    {
      status: true, // Randomly assign status
      description: `Appointment request description `,
      proposedDate: new Date(),
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0], // Assuming users[0] exists,
    },
    {
      status: true, // Randomly assign status
      description: `Appointment request description `,
      proposedDate: new Date(),
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0], // Assuming users[0] exists,
    },
    {
      description: `Appointment request description `,
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0], // Assuming users[0] exists,
    },
    {
      status: true, // Randomly assign status
      description: `Appointment request description `,
      proposedDate: new Date(),
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0], // Assuming users[0] exists,
    },
    {
      description: `Appointment request description `,
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0], // Assuming users[0] exists,
    },
    {
      status: true, // Randomly assign status
      description: `Appointment request description `,
      proposedDate: new Date(),
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0], // Assuming users[0] exists,
    },
    {
      description: `Appointment request description `,
      specialist: users[1], // Assign clinics in a round-robin manner
      user: users[0], // Assuming users[0] exists,
    },
  ];


  for (const request of requests) {
    const newRequest = client.getRepository(AppointmentRequest).create(request);
    await client.getRepository(AppointmentRequest).save(newRequest);
  }  

  return;
}
