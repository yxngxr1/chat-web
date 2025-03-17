export interface CreateChatRequest {
    name: string;
    userIds?: number[]; 
    chatType: 'PRIVATE' | 'GROUP' | 'SELF';
}