import { getSequelize } from "../config/connection.ts";
import { createUserModel } from "./User.ts";

export const User = createUserModel(getSequelize());

