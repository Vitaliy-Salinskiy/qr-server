const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(token);
import { Telegraf } from 'telegraf';
import { mainBoard, requestKeyBoard, returnToGeneral, returnBoardToProducts, productKeyBoard, returnBoardToRequests } from './boards/index.js';

export const botStart = () => {
    let historyInfo = { historyPag: 1, historyPagLimit: 1, historyString: '⏳Історія запитів:' };
    let requestInfo = { requestPag: 1, requestPagLimit: 1 };
    let products = [], selectedProduct = [], requests = [], selectedRequest = [];
    let isProducts = false, isRequests = false, isHistory = false, isLoggining = true;

    bot.start((ctx) => {
        ctx.reply('Вітаємо в телеграм боті!👋');
        ctx.reply('🔐Введіть пароль для входу в адмін панель🔐');
    });
    
    const getGeneralMenu = (ctx) => {
        isProducts = false;
        isRequests = false;
        isHistory = false;
        ctx.reply('👤Головне меню👤', mainBoard);
        historyInfo = { historyPag: 1, historyPagLimit: 1, historyString: '⏳Історія запитів:' };
        requestInfo = { requestPag: 1, requestPagLimit: 1 };
        products = [], selectedProduct = [], requests = [], selectedRequest = [];
        isProducts = false, isRequests = false, isHistory = false;
    }

    bot.hears(/.*/, async (ctx) => {
        if (isLoggining) {
            const userPassword = ctx.message.text;
            const postData = { username: 'admin', password: userPassword };

            fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            })
                .then((response) => {
                    if (response.status === 200) {
                        isLoggining = false;
                        ctx.reply("✅Успішний вхід!✅", mainBoard)
                    } else ctx.reply('❌Невірний пароль.❌');
                });
        } else {
            ctx.reply('Я вас не розумію!🤷');
        }
    });

    const getHistory = async (ctx) => {
        try {
            isHistory = true;
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

    const getRequests = async (ctx) => {
        try {
            isRequests = true;
            const response = await fetch(`http://localhost:5000/requests/pending?page=${requestInfo.requestPag}`);
            requests = await response.json();
            requestInfo.requestPagLimit = requests.totalPages;

            requests = requests.requests;

            let requestsInline = requests.map(request => [
                { text: `❔${request.productId.name}: ${request._id}❔`, callback_data: request._id }
            ]); 
            
            requestsInline.push(
                [
                    { text: "⬅️", callback_data: "prev-request-pag" },
                    { text: '🎯1', callback_data: "set-request-page-first" },
                    { text: requestInfo.requestPag, callback_data: "none" },
                    { text: `🎯${requestInfo.requestPagLimit}`, callback_data: "set-request-page-last" },
                    { text: "➡️", callback_data: "next-request-pag" }                  
                ]
            );

            requestsInline.push([{ text: "Повернутись на головну⬅️", callback_data: "general_menu" }]);
            
            const requestKeyBoard = {
                reply_markup: { inline_keyboard: requestsInline }
            };

            ctx.reply('📋Список запитів: ', requestKeyBoard);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    }

    bot.on('callback_query', async (ctx) => {
        const callback_data = ctx.callbackQuery.data;

        // Обробка продуктів
        if (callback_data === 'products') {
            try {
                isProducts = true;
                const response = await fetch('http://localhost:5000/products');
                products = await response.json();

                let productsInline = products.map(product => ([{ text: `🪙${product.name}🪙`, callback_data: product._id }]));
                
                productsInline.push([{ text: "Повернутись⬅️", callback_data: "general_menu"}]);

                const productsKeyBoard = {
                    reply_markup: { inline_keyboard: productsInline }
                };

                ctx.reply('📋Список продуктів: ', productsKeyBoard);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }
        if (isProducts) {
            if (callback_data !== 'products' && callback_data !== 'remove' && callback_data !== 'general_menu') {
                const selectProduct = products.find(product => product._id === callback_data);
                ctx.reply(`🧺Продукт: ${selectProduct.name}`, productKeyBoard);
                
                selectedProduct = selectProduct;
            }
            if (callback_data === 'remove') {
                fetch(`http://localhost:5000/products/${selectedProduct._id}`, { method: 'DELETE' });
                ctx.reply('Продукт видалено✅', returnBoardToProducts)
            }
        }
        
        // Обробка запитів
        if (callback_data === 'requests') {
            getRequests(ctx);
        }
        if (isRequests) {
            if (callback_data === 'prev-request-pag') {
                if (requestInfo.requestPag > 1) {
                    requestInfo.requestPag--;
                    getRequests(ctx);
                }else getRequests(ctx);
            }
            if (callback_data === 'next-request-pag') {
                if (requestInfo.requestPag < requestInfo.requestPagLimit) {
                    requestInfo.requestPag++;
                    getRequests(ctx);
                } else getRequests(ctx);
            }
            if (callback_data === 'set-request-page-first') {
                requestInfo.requestPag = 1;
                getRequests(ctx);
            }
            if (callback_data === 'set-request-page-last') {
                requestInfo.requestPag = requestInfo.requestPagLimit;
                getRequests(ctx);
            }
            if (callback_data !== 'requests' && callback_data !== 'allow', callback_data !== 'deny' && callback_data !== 'general_menu') {
                const selectRequest = requests.find(request => request._id === callback_data);

                if (selectRequest) {
                    const reqString = `🔀Запит - ${selectRequest.productId.name}: ${selectRequest._id}`;
                    ctx.reply(reqString, requestKeyBoard);
                    
                    selectedRequest = selectRequest;
                }
            }
            if (callback_data === 'allow') {
                fetch(`http://localhost:5000/requests/${selectedRequest._id}/allow`, { method: 'POST' });
                ctx.reply('Запит прийнято', returnBoardToRequests);
            }
            if (callback_data === 'deny') {
                fetch(`http://localhost:5000/requests/${selectedRequest._id}/deny`, { method: 'POST' });
                ctx.reply('Запит відхилено', returnBoardToRequests);
            }
        }

        // Обробка історії
        if (callback_data === 'history') {
            isHistory = true;
            getHistory(ctx);
        }

        if (isHistory) {
            if (callback_data === 'prev-history-pag') {
                if (historyInfo.historyPag > 1) {
                    historyInfo.historyPag--;
                    getHistory(ctx);
                } else getHistory(ctx);
            }
            if (callback_data === 'next-history-pag') {
                if (historyInfo.historyPag <= historyInfo.historyPagLimit - 1) {
                    historyInfo.historyPag++;
                    getHistory(ctx);
                } else getHistory(ctx);
            }
            if (callback_data === 'set-history-page-first') {
                historyInfo.historyPag = 1;
                getHistory(ctx);
            }
            if (callback_data === 'set-history-page-last') {
                historyInfo.historyPag = historyInfo.historyPagLimit;
                getHistory(ctx);
            }
        }
        // Перехід на головне меню
        if (callback_data === 'general_menu') {
            getGeneralMenu(ctx);
        }
    });
    
    bot.launch();
}