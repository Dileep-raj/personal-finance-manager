import { UserPayload } from "@/lib/mongodb/models/user.model";

export type UserDetails = Pick<UserPayload, "firstname" | "lastname" | "username">
