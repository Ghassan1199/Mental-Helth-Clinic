import { Admin } from "../../../entities/Admin";




export interface IAdminRepository {
    createAdmin(fullName: string, email: string, password: string, isSuper: boolean): Promise<Admin>;
    getAdminById(id: number): Promise<Admin | null>;
    getAdminByEmail(email: string): Promise<Admin | null>;

}
