import { Chat } from "../../domain/entities/Chat";
import { generateRtcToken } from "../../application/services/chat/RTC.Service"; // Import the function

class ChatResource {
  constructor() {}

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

  async initializeResource(chat: Chat) {
    return {
      id: chat.id,
      channelName: chat.channelName,
      patientId: await chat.patient.id,
      specId: await chat.specialistId,
      specialistName: await chat.specialist.specialistProfile?.fullName,
      specialistPhoto: await chat.specialist.specialistProfile?.photo,
      token: await generateRtcToken(chat.channelName),
      roleId: await chat.specialist.roleId
    };
  }
}

export default ChatResource;
