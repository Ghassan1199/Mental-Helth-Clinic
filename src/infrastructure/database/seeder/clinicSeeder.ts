import { connectToDatabase } from "../index";
import { User } from "../../../domain/entities/User";
import bcrypt from "bcrypt";
import { SpecialistProfile } from "../../../domain/entities/SpecialistProfile";
import { UserProfile } from "../../../domain/entities/UserProfile";
import { Clinic } from "../../../domain/entities/Clinic";

export async function seedClinics(users: any) {
  const client = await connectToDatabase();

  const clinics = [
    {
      name: `Clinic name`,
      totalRate: 0,
      doctorId: users[1].id,
      cityId: 3, // Assign cities in a round-robin manner
      address: `Address `,
      latitude: "0.000000",
      longitude: "0.000000",
    },
  ];

  for (const clinic of clinics) {
    const newClinic = await client.getRepository(Clinic).create(clinic);
    await client.getRepository(Clinic).save(newClinic);
  }

  return;
}
