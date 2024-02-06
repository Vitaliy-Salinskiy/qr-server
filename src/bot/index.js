const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(token);
import { Telegraf, Markup } from 'telegraf';
import { mainBoard } from './boards/index.js';
import { returnBoard } from './boards/index.js';
import { productKeyBoard } from './boards/index.js';

export const botStart = () => {
    let isLoggining = true;
    let isProducts = false;
    let isRequests = false;
    let isHistory = false;
    const adminPassword = "admin";
    let products = [];
    let selectedProduct = [];

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
                
                ctx.reply("Вітаємо в панелі адміністратора", mainBoard)
                isLoggining = false;
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
                
                productsInline.push([{ text: "Повернутись на головну", callback_data: "general_menu" }]);

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
                ctx.reply('Продукт видалено', returnBoard)
            }
        }
        
        

        // Перехід на головне меню
        if (callback_data === 'general_menu') {
            getGeneralMenu(ctx);
        }
    });
    
    bot.launch();
}