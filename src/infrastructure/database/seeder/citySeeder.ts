import { connectToDatabase } from "../index";
import { City } from "../../../domain/entities/City";

export async function seedCities() {
  const client = await connectToDatabase();

  const cities = [
    {
      name: "tahran",
    },
    {
      name: "damascus",
    },
    {
      name: "bushragi",
    },
  ];

  for (const city of cities) {
    const newCity = await client.getRepository(City).create(city);
    await client.getRepository(City).save(newCity);
  }

  return;
}
