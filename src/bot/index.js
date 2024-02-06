const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(token);
import { Telegraf } from 'telegraf';
import { mainBoard, requestKeyBoard, returnToGeneral, returnBoardToProducts, productKeyBoard, returnBoardToRequests } from './boards/index.js';

export const botStart = () => {
    let isProducts = false;
    let isRequests = false;
    let isHistory = false;
    const adminPassword = "admin";
    let products = [];
    let selectedProduct = [];
    let requests = [];
    let selectedRequest = [];
    let isLoggining = true;
    let historyString = ''; 

    bot.start((ctx) => {
        ctx.reply('Вітаємо в телеграм боті!');
        ctx.reply('Введіть пароль в адмін панель:');
    });
    
    const getGeneralMenu = (ctx) => {
        isProducts = false;
        isRequests = false;
        isHistory = false;
        ctx.reply('Головне меню', mainBoard);
    }

    bot.hears(/.*/, async (ctx) => {
        if (isLoggining) {
            const userPassword = ctx.message.text;
            if (userPassword === adminPassword) {
                isLoggining = false;
                ctx.reply("Вітаємо в панелі адміністратора", mainBoard)
            } else {
                ctx.reply('Невірний пароль.');
            }
        } else {
            ctx.reply('Я вас не розумію!');
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

                let productsInline = products.map(product => [
                    { text: product.name, callback_data: product._id }
                ]);
                
                productsInline.push(returnToGeneral);

                const productKeyBoard = {
                    reply_markup: { inline_keyboard: productsInline }
                };

                ctx.reply('Список продуктів: ', productKeyBoard);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }
        if (isProducts) {
            if (callback_data !== 'products' && callback_data !== 'remove' && callback_data !== 'general_menu') {
                const selectProduct = products.find(product => product._id === callback_data);
                ctx.reply(`Продукт: ${selectProduct.name}`, productKeyBoard);
                
                selectedProduct = selectProduct;
            }
            if (callback_data === 'remove') {
                fetch(`http://localhost:5000/products/${selectedProduct._id}`, { method: 'DELETE' });
                ctx.reply('Продукт видалено', returnBoardToProducts)
            }
        }
        
        // Обробка запитів
        if (callback_data === 'requests') {
            try {
                isRequests = true;
                const response = await fetch('http://localhost:5000/requests/pending');
                requests = await response.json();
                requests = requests.requests;

                let requestsInline = requests.map(request => [
                    { text: `${request.productId.name}: ${request._id}`, callback_data: request._id }
                ]); 
                
                requestsInline.push(returnToGeneral);

                const requestKeyBoard = {
                    reply_markup: { inline_keyboard: requestsInline }
                };

                ctx.reply('Список запитів: ', requestKeyBoard);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        }
        if (isRequests) {
            if (callback_data !== 'requests' && callback_data !== 'allow', callback_data !== 'deny' && callback_data !== 'general_menu') {
                const selectRequest = requests.find(request => request._id === callback_data);
                if (selectRequest) {
                    const reqString = `Запит - ${selectRequest.productId.name}: ${selectRequest._id}`;
                    ctx.reply(reqString, requestKeyBoard);
                    
                    selectedRequest = selectRequest;
                }
            }
            if (callback_data === 'allow') {
                fetch(`http://localhost:5000/requests/${selectedRequest._id}/allow`, { method: 'POST' });
                ctx.reply('Запит прийнято', returnBoardToRequests)
            }
            if (callback_data === 'deny') {
                fetch(`http://localhost:5000/requests/${selectedRequest._id}/deny`, { method: 'POST' });
                ctx.reply('Запит відхилено', returnBoardToRequests)
            }
        }

        // Обробка історії
        if (callback_data === 'history') {
            try {
                isRequests = true;
                const response = await fetch('http://localhost:5000/requests/pending');
                requests = await response.json();
                requests = requests.requests;                
                historyString = 'Історія запитів:'

                requests.map(request => {
                    historyString += `
                        \nId запиту: ${request._id}
                        \nId продукту: ${request.productId._id}
                        \nСтатус запита: ${request.status}
                        \nСтворений: ${new Date(request.createdAt).toLocaleString()}
                        \nЗмінений: ${new Date(request.updatedAt).toLocaleString()}                   
                    `;
                });

                ctx.reply(historyString, returnToGeneral)
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        }
        // Перехід на головне меню
        if (callback_data === 'general_menu') {
            getGeneralMenu(ctx);
        }
    });
    
    bot.launch();
}