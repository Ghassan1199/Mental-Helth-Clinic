import {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} from "agora-access-token";
import "dotenv/config";

let appID = process.env.AGORA_APP_ID;
let appCertificate = process.env.AGORA_APP_CERTIFICATE;

export const generateRtcToken = async (channelName: string) => {
  const expirationTimeInSeconds = 3600;
  const uid = 0;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  const role = RtcRole.PUBLISHER;
  return RtcTokenBuilder.buildTokenWithUid(
    appID!,
    appCertificate!,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
};

export const generateRtmToken = async (account: any, uid: number | 0) => {
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  return RtmTokenBuilder.buildToken(
    appID!,
    appCertificate!,
    account,
    RtmRole.Rtm_User,
    privilegeExpiredTs
  );
};
