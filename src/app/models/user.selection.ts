import { UserDTO } from "../api";


export interface UserWithSelection extends UserDTO {
  selected: boolean;
}