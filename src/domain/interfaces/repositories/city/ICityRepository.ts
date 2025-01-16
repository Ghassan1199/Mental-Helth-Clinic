import { City } from "../../../entities/City";



export interface ICityRepository {
    createCity(ar: string, eng: string): Promise<void>;
    getCities(): Promise<City[]>;
}
