export const getHistory = async (ctx, historyInfo, requests) => {
    try {
        historyInfo.historyString = '⏳Історія запитів:';
        const response = await fetch(`http://localhost:5000/requests?page=${historyInfo.historyPag}`);
        requests = await response.json();
        historyInfo.historyPagLimit = requests.totalPages;

        requests = requests.requests;

        requests.map(request => {
            historyInfo.historyString += `
                \n🆔Id запиту: ${request._id}\n🆔Id продукту: ${request.productId._id}\nℹ️Статус запита: ${request.status}\n📅Створений: ${new Date(request.createdAt).toLocaleString()}\n📅Змінений: ${new Date(request.updatedAt).toLocaleString()}                   
            `;
        });

        ctx.reply(historyInfo.historyString, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "⬅️", callback_data: "prev-history-pag" },
                        { text: '🎯1', callback_data: "set-history-page-first" },
                        { text: `${historyInfo.historyPag}`, callback_data: "none" },
                        { text: `🎯${historyInfo.historyPagLimit}`, callback_data: "set-history-page-last" },
                        { text: "➡️", callback_data: "next-history-pag" }
                    ],
                    [
                        { text: "Повернутись на головну⬅️", callback_data: "general_menu"},
                    ]
                ]
            }
        })
    } catch (error) {
        console.error('Error fetching history:', error);
    }
};
