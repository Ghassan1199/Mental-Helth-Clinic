import { connectToDatabase } from "../..";
import { DataSource, EntityManager } from "typeorm";
import { IUserProfileRepository } from "../../../../domain/interfaces/repositories/IUserProfileRepository";
import { UserProfile } from "../../../../domain/entities/UserProfile";

export class PatientProfileMysqlRepository implements IUserProfileRepository {
    private client!: DataSource;

    constructor() {
        this.init();
    }

    private async init() {
        this.client = await connectToDatabase();
    }

    async create(input: any, entityManager: EntityManager): Promise<UserProfile> {
        let {
            dateOfBirth,
            gender,
            fullName,
            maritalStatus,
            children,
            hoursOfWork,
            placeOfWork,
            profession,
            userId,
            deviceToken,
            email
        } = input;
        if(!fullName){
            const emailParts = email.split("@");
            fullName = emailParts[0];
        }
        if(!hoursOfWork){
            hoursOfWork=0;
        }
        if(!placeOfWork){
            placeOfWork="did not provide";
        }

        let record = entityManager.create(UserProfile, {
          dateOfBirth: dateOfBirth,
          gender: gender,
          fullName: fullName,
          maritalStatus: maritalStatus,
          children: children,
          profession: profession,
          hoursOfWork: hoursOfWork,
          placeOfWork: placeOfWork,
          user: userId,
          deviceToken: deviceToken,
        });
        
        const savedProfile = await entityManager.save(record);
        return savedProfile;
    }
}
