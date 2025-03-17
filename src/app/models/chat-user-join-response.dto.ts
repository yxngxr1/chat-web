// chat-user-join-response.dto.ts
export interface ChatUserJoinResponse {
    chatId: number;
    userId: number;
    success: boolean;
    // Добавьте другие поля, если backend возвращает больше данных
  }