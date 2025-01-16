import { User } from "../../domain/entities/User";

class DoctorResource {
    constructor() {
    }

    async init(model: any) {
        if (Array.isArray(model)) {
            let resources = [];
            for (let i = 0; i < model.length; i++) {
                resources.push(await this.initializeResource(model[i]));
            }
            return resources;
        } else {
            return await this.initializeResource(model);
        }
    }

    async initializeResource(doctor: User) {
        return {
            id: doctor.id,
            name: doctor.specialistProfile?.fullName,
            city: doctor.clinic?.city.name,
            address: doctor.clinic?.address,
        };
    }
}
export default DoctorResource;
