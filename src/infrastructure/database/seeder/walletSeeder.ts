import { connectToDatabase } from "../index";
import { User } from "../../../domain/entities/User";
import bcrypt from "bcrypt";
import { SpecialistProfile } from "../../../domain/entities/SpecialistProfile";
import { UserProfile } from "../../../domain/entities/UserProfile";
import { Wallet } from "../../../domain/entities/Wallet";

export async function seedWallet(users: any) {
  const client = await connectToDatabase();

  const wallets = [
    {
      user: users[0],
      balance: 1000000,
    },
    {
      user: users[1],
      balance: 500000,
    },
    {
      user: users[2],
      balance: 750000,
    },
  ];


  for (const wallet of wallets) {
    const newProfile = await client.getRepository(Wallet).create(wallet);
    await client.getRepository(Wallet).save(newProfile);
  }

  return;
}
