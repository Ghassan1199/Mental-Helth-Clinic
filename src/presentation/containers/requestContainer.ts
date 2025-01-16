import { container } from "tsyringe";
import UserValidator from "../request/userRegister.request";
import RateValidator from "../request/rate.request";

// Register requests
container.registerSingleton(UserValidator);
container.registerSingleton(RateValidator);
export { container as requestContainer };
