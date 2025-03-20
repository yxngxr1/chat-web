/**
 * OpenAPI definition
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


/**
 * Запрос на создание нового сообщения в чате
 */
export interface MessageCreateRequest { 
    /**
     * Идентификатор чата, в котором будет отправлено сообщение
     */
    chatId: number;
    /**
     * Текст сообщения
     */
    content: string;
}

