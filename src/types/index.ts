import { IUser } from "../model/user_model";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
