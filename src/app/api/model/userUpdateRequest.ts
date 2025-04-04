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
 * Запрос на обновление данных пользователя, включая имя, email и пароль
 */
export interface UserUpdateRequest { 
    /**
     * Имя пользователя
     */
    username?: string;
    /**
     * Адрес электронной почты
     */
    email?: string;
    /**
     * Пароль
     */
    password?: string;
}

