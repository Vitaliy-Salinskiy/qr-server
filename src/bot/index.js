const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(token);
import { Telegraf } from 'telegraf';
import { mainBoard, requestKeyBoard, returnToGeneral, returnBoardToProducts, productKeyBoard, returnBoardToRequests } from './boards/index.js';
import { getHistory } from './methods/index.js';

export const botStart = () => {
    let historyInfo = { historyPag: 1, historyPagLimit: 1, historyString: '⏳Історія запитів:' };
    let requestInfo = { requestPag: 1, requestPagLimit: 1 };
    let products = [], selectedProduct = [], requests = [], selectedRequest = [];
    let isProducts = false, isRequests = false, isHistory = false, isLoggining = true;

    bot.start((ctx) => {
        ctx.reply('Вітаємо в телеграм боті!👋');
        ctx.reply('🔐Введіть пароль для входу в адмін панель🔐');
    });
    
    const getRequests = async (ctx, requestInfo) => {
        try {
            const response = await fetch(`http://localhost:5000/requests/pending?page=${requestInfo.requestPag}`);
            requests = await response.json();
            requestInfo.requestPagLimit = requests.totalPages;
    
            requests = requests.requests;
            console.log(requests)
    
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
    
            return [true, requests];
        } catch (error) {
            console.error('Error fetching requests:', error);
            return [false, []];
        }
    }

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
        if (callback_data === 'requests') isRequests = true;
    
        if (isRequests && callback_data !== 'general_menu') {
            if (callback_data === 'prev-request-pag') {
                if (requestInfo.requestPag > 1) requestInfo.requestPag--;
            } else if (callback_data === 'next-request-pag') {
                if (requestInfo.requestPag < requestInfo.requestPagLimit) requestInfo.requestPag++;
            } else if (callback_data === 'set-request-page-first') {
                requestInfo.requestPag = 1;
            } else if (callback_data === 'set-request-page-last') {
                requestInfo.requestPag = requestInfo.requestPagLimit;
            } else if (callback_data === 'allow') {
                fetch(`http://localhost:5000/requests/${selectedRequest._id}/allow`, { method: 'POST' });
                ctx.reply('Запит прийнято', returnBoardToRequests);
                requestInfo.requestPag = 1;
            } else if (callback_data === 'deny') {
                fetch(`http://localhost:5000/requests/${selectedRequest._id}/deny`, { method: 'POST' });
                ctx.reply('Запит відхилено', returnBoardToRequests);
                requestInfo.requestPag = 1;
            } else if (callback_data !== 'requests' && callback_data !== 'allow' && callback_data !== 'deny') {
                const selectRequest = requests.find(request => request._id === callback_data);
                if (selectRequest) {
                    const reqString = `🔀Запит - ${selectRequest.productId.name}: ${selectRequest._id}`;
                    ctx.reply(reqString, requestKeyBoard);
                    selectedRequest = selectRequest;
                }
            }
            if (callback_data == 'requests' || callback_data == 'allow' && callback_data == 'deny' || callback_data == 'set-request-page-last' || callback_data == 'set-request-page-first' || callback_data == 'next-request-pag' || callback_data == 'prev-request-pag') getRequests(ctx, requestInfo);
        }

        // Обробка історії
        if (callback_data === 'history') isHistory = true;    

        if (isHistory && callback_data !== 'general_menu') {
            if (callback_data === 'prev-history-pag' && historyInfo.historyPag > 1) {
                historyInfo.historyPag--;
            } else if (callback_data === 'next-history-pag' && historyInfo.historyPag < historyInfo.historyPagLimit - 1) {
                historyInfo.historyPag++;
            } else if (callback_data === 'set-history-page-first') {
                historyInfo.historyPag = 1;
            } else if (callback_data === 'set-history-page-last') {
                historyInfo.historyPag = historyInfo.historyPagLimit;
            }
            getHistory(ctx, historyInfo, requests, isHistory);
        }
        
        // Перехід на головне меню
        if (callback_data === 'general_menu') {
            getGeneralMenu(ctx);
        }
    });
    
    bot.launch();
}