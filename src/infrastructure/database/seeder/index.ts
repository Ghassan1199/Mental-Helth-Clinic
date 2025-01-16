import { seedAppointmentRequest } from "./Appointment/AppointmentRequestSeeder";
import { seedAppointment } from "./Appointment/AppointmentSeeder";
import { seedCities } from "./citySeeder";
import { seedClinics } from "./clinicSeeder";
import { seedUserProfiles } from "./userProfileSeeder";
import { seedUsers } from "./userSeeder";
import { seedWallet } from "./walletSeeder";

export async function seed() {
  try {
    const users = await seedUsers();
    await seedUserProfiles(users);
      await seedWallet(users);
      await seedCities();
      await seedClinics(users);
      await seedAppointmentRequest(users);
    await seedAppointment(users);
        console.log("seed completed");

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seed().catch((error) => console.log(error));
