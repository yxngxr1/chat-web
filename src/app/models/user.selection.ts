import { UserDTO } from "./user.dto";

export interface UserWithSelection extends UserDTO {
  selected: boolean;
}