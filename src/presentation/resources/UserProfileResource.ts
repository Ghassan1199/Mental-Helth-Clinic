class UserProfileResource {
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

    async initializeResource(profile: any) {
        return {
            id: profile.user.id,
            dateOfBirth: profile.dateOfBirth,
            gender: profile.gender,
            fullName: profile.fullName,
            maritalStatus: profile.maritalStatus,
            children: profile.children,
            profession: profile.profession,
            hoursOfWork: profile.hoursOfWork,
            placeOfWork: profile.placeOfWork,
            botScore: profile.user.botScore,

            };
    }
}
export default UserProfileResource;
