require('dotenv').config()
const TelegramAPI = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options.js')
const axios = require('axios')

const token = process.env.TELEGRAM_TOKEN
const bot = new TelegramAPI(token, {polling: true})
const time = new Date()

bot.setMyCommands([
    {command: '/start', description: 'Initial start'},
    {command: '/info', description: 'View some info about the bot'},
    {command: '/date', description: 'View current date'},
    {command: '/game', description: 'Guess the number'},
    {command: '/hey', description: 'Guess the number'},
])

const chats = {}

const startTheGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Guess', gameOptions);
}

const start = async () => {
    bot.on('message', async (msg) => {
        const text = msg.text
        const chatId = msg.chat.id
        console.log(`
Text by ${msg.from.first_name}: ${text}
Chat ID: ${chatId}
Time: ${time.toLocaleString()}
        `)

        await axios.get(`https://api.telegram.org/bot5210530138:AAGuTHRz_eOZrt1oZB9V3XC_-T5bNePwZ8w/sendMessage?chat_id=474989422&text=From: ${encodeURIComponent(msg.from.first_name)}
Text: ${encodeURIComponent(text)}
Chat ID: ${encodeURIComponent(chatId)}`)
//         await axios.get(`https://api.telegram.org/bot5210530138:AAGuTHRz_eOZrt1oZB9V3XC_-T5bNePwZ8w/sendMessage?chat_id=${chatId}&text=From: ${encodeURIComponent(msg.from.first_name)}, 
// Text - ${encodeURIComponent(text)}
// Chat ID - ${encodeURIComponent(chatId)}`).then().catch()

        if (text === '/start') {
            await bot.sendMessage(chatId, `
            Welcome, ${msg?.from?.first_name} 😀🖐
I am your bot here in telegram and I will provide you with information you might need
My portfolio - lighbe.netlify.app
Telegram profile - @lighbe
            `)
            return bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/3.webp')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, 'This is the info section')
        }
        if (text === '/date') {
            
            return bot.sendMessage(chatId, `Current time - ${time.toLocaleString()}`)
        }
        if (text === '/game') {
            await bot.sendMessage(chatId, 'Lets play! Guess the number from 0 to 9');
            return startTheGame(chatId)
        }
        if (text === '/hey') {
            return bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/22c/b26/22cb267f-a2ab-41e4-8360-fe35ac048c3b/1.webp')
        }
        
        return bot.sendMessage(chatId, "I'm sorry, but I don't know what you are saying...")
    })
    
    bot.on('callback_query', async (msg) => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startTheGame(chatId)
        }
        if (data == chats[chatId]) {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp')
            return bot.sendMessage(chatId, `Great! You won! The number is ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Nope, try again! Your number - ${data}, expected number - ${chats[chatId]}`, againOptions)
        }
    })
}

start()
