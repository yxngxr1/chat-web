import { ChatDTO } from "../api";

export interface ChatUnreadDto extends ChatDTO {
  unreadCount?: number;
}