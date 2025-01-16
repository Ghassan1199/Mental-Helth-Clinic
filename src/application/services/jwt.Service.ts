import jwt, { JwtPayload } from "jsonwebtoken";
import { injectable } from "tsyringe";
require("dotenv").config();
@injectable()
export class JwtService {
  constructor() {}

  async create(): Promise<any> {}

  async generateAccessToken(userId: number, type: string = "user") {
    if (type == "user") {
      return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: 365 + "d",
      });
    } else {
      return jwt.sign(
        { userId },
        process.env.ADMIN_ACCESS_SECRET_KEY as string,
        {
          expiresIn: 365 + "d",
        }
      );
    }

    // expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN + "m",
  }

  async generateRefreshToken(userId: number) {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN + "d",
    });
  }

  async verify(
    refreshToken: string,
    type: string = "acc",
    tokenUser: string = "user"
  ): Promise<JwtPayload> {
    let secret;
    if (tokenUser == "user") {
      if (type == "acc") {
        secret = process.env.ACCESS_TOKEN_SECRET;
      } else {
        secret = process.env.REFRESH_TOKEN_SECRET;
      }
    } else {
      secret = process.env.ADMIN_ACCESS_SECRET_KEY;
    }

    return jwt.verify(refreshToken, secret!) as JwtPayload;
  }
}
export default JwtService;
