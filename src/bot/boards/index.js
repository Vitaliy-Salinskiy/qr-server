export const mainBoard = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "Продукти", callback_data: "products"},
                { text: "Запити", callback_data: "requests"}
            ],
            [
                { text: "Історія", callback_data: "history"},
            ]
        ]
    }
};

export const returnBoard = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "Повернутись", callback_data: "products"},
            ]
        ]
    }
}

export const productKeyBoard = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "Видалити", callback_data: "remove"},
                { text: "Повернутись", callback_data: "products"},
            ]
        ]
    }
}