// Приводим ошибки Matrix к человекочитаемому виду
export const parseMatrixError = (message: string): string => {
    if (message.includes('M_FORBIDDEN')) {
        return 'Неверное имя пользователя или пароль.'
    }
    if (message.includes('M_USER_DEACTIVATED')) {
        return 'Учётная запись деактивирована.'
    }
    if (message.includes('M_UNKNOWN_TOKEN')) {
        return 'Сессия истекла. Войдите снова.'
    }
    return 'Не удалось войти. Попробуйте ещё раз.'
}
