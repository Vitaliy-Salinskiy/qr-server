export const mainBoard = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "🧺Продукти🧺", callback_data: "products"},
                { text: "❓Запити❓", callback_data: "requests"}
            ],
            [
                { text: "⏳Історія⏳", callback_data: "history"},
            ]
        ]
    }
};

export const returnBoardToProducts = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "Повернутись⬅️", callback_data: "products"},
            ]
        ]
    }
}

export const returnToGeneral = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "Повернутись⬅️", callback_data: "general_menu"},
            ]
        ]
    }
}

export const returnBoardToRequests = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "Повернутись⬅️", callback_data: "requests"},
            ]
        ]
    }
}

export const productKeyBoard = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "❌Видалити❌", callback_data: "remove"},
                { text: "Повернутись⬅️", callback_data: "products"},
            ]
        ]
    }
}

export const requestKeyBoard = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "✅Прийняти✅", callback_data: "allow" },
                { text: "❌Відхилити❌", callback_data: "deny"},
                { text: "Повернутись⬅️", callback_data: "requests"},
            ]
        ]
    }
}