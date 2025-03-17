export interface MessageDTO {
    id?: number;           // Опционально, так как может отсутствовать при создании
    chatId: number;        // ID чата
    senderId?: number;      // ID отправителя
    content: string;       // Текст сообщения
    sentAt?: string;       // Используем string, так как JSON не имеет типа LocalDateTime
  }