export interface CreateChatRequest {
    name?: string;
    description?: string;
    userIds?: number[]; 
    chatType: 'PRIVATE' | 'GROUP' | 'SELF';
}