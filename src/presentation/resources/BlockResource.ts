import { Blocking } from "../../domain/entities/Blocking";

class BlockResource {
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

    async initializeResource(block: Blocking) {

        return {            
            id: block.id,
            doctorId: block.doctorId,
            doctorName: block.doctor.specialistProfile?.fullName,
            userId: block.userId,
            userName: block.user.userProfile?.fullName,
            date: block.date
        };                            
    }
}
export default BlockResource;  
