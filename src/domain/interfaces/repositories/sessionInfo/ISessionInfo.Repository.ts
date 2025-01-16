import { SessionInfo } from "../../../entities/SessionInfo";

export interface ISessionInfoRepository {
  createSessionInfo(time: string, price: number): Promise<void>;
  getOne(sessionInfoId: number): Promise<SessionInfo | null>;
  get(): Promise<SessionInfo[]>;
  update(record: SessionInfo): Promise<void>;
}
