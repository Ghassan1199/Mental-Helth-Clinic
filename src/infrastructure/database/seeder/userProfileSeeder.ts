import { connectToDatabase } from "../index";
import { User } from "../../../domain/entities/User";
import bcrypt from "bcrypt";
import { SpecialistProfile } from "../../../domain/entities/SpecialistProfile";
import { UserProfile } from "../../../domain/entities/UserProfile";

export async function seedUserProfiles(users:any) {
  const client = await connectToDatabase();

  const profiles = [
    {
      fullName: "Dr. John Smith",
      dateOfBirth: new Date(1980, 5, 15),
      gender: true,
      photo: "there is no for now",
      phone: 1234567,
      status: "verified",
      userId: users[1].id, // Assuming users[0] exists
      studyInfo: "MBBS, MD",
      specInfo: "Cardiology",
    },
    {
      fullName: "Dr. Jane Doe",
      dateOfBirth: new Date(1985, 7, 20),
      gender: false,
      photo: "there is no for now",
      phone: 9876543,
      status: "verified",
      userId: users[2].id,
      studyInfo: "MBBS, MS",
      specInfo: "Neurology",
    },
  ];

    const userProfiles = [{
      dateOfBirth: new Date(1990, 1, 1),
      gender: true,
      fullName: "John Doe",
      maritalStatus: "Single",
      children: 0,
      profession: "Software Engineer",
      hoursOfWork: 40,
      placeOfWork: "Company A",
      user: users[0], // Assuming users[0] exists
    },];

    for (const profile of userProfiles) {

        const newProfile = await client
            .getRepository(UserProfile)
            .create(profile);
        await client.getRepository(UserProfile).save(newProfile);
    }

  for (const profile of profiles) {
    const newProfile = client.getRepository(SpecialistProfile).create(profile);
    await client.getRepository(SpecialistProfile).save(newProfile);
  }

  return;
}
