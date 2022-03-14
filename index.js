require('dotenv').config()
const TelegramAPI = require('node-telegram-bot-api')
const axios = require('axios')
const {gameOptions, againOptions, requestInfo} = require('./options.js')
const {startMessage, infoMessage, currentDate, textToBot} = require('./components')

const token = process.env.TELEGRAM_TOKEN
const bot = new TelegramAPI(token, {polling: true})




bot.setMyCommands([
    {command: '/start', description: 'Initial start'},
    {command: '/info', description: 'View some info about the bot'},
    {command: '/date', description: 'View current date'},
    {command: '/game', description: 'Guess the number'},
    {command: '/hey', description: 'Say hi'},
    {command: '/sendinfo', description: 'Send your location or contact information'},
])

const chats = {}

const isRussian = (lang, msgRus, msgEng) => {
    return lang === 'ru' ? msgRus : msgEng
}

const startTheGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, '☘', gameOptions);
console.log(chats)

}



const start = async () => {
    
    bot.on('message', async (msg) => {
        const text = msg.text
        const chatId = msg.chat.id
        const lang = msg.from.language_code
        console.log(msg)

        await axios.get(`https://api.telegram.org/bot${process.env.SEND_TO_BOT}/sendMessage?chat_id=474989422&text=${textToBot(msg)}&parse_mode=HTML`)

        if (text === 'hi') {
            return bot.sendMessage(chatId, 'Hey there! 🙋‍♀️')
        }

        if (text === '/start') {
            // await bot.sendMessage(chatId, `${msg.from.language_code == 'ru' ? startMessage(msg.from.first_name).ru : startMessage(msg.from.first_name).eng}`, {parse_mode: 'HTML'})
            await bot.sendMessage(chatId, startMessage(msg.from.first_name)[lang] || startMessage(msg.from.first_name).eng, {parse_mode: 'HTML'})
            return bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/3.webp')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, infoMessage[lang] || infoMessage.eng, {parse_mode: 'HTML'})
        }
        if (text === '/date') {
            return bot.sendMessage(chatId, currentDate[lang] || currentDate.en)
        }
        if (text === '/game') {
            await bot.sendMessage(chatId, lang == 'ru' ? 'Давай сыграем в игру! Я загадал число от 0 до 9. Попробуй угадать его' : 'Lets play! Guess the number from 0 to 9');
            return startTheGame(chatId)
        }
        if (text === '/hey') {
            return bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/22c/b26/22cb267f-a2ab-41e4-8360-fe35ac048c3b/1.webp')
        }
        if (text === '/sendinfo') {
            return bot.sendMessage(chatId, isRussian(lang, 'Хорошо, теперь выбери одну из опций', 'Okay, now choose one of the options'), requestInfo)
        }
        if (msg.contact) {
            return bot.sendMessage(chatId, isRussian(lang, 'Хорошо, принял!', 'Okay, got it!'), {reply_markup:{remove_keyboard: true}})
        }
        if (msg.location) {
            return bot.sendMessage(chatId, isRussian(lang, 'Хорошо, я получил ваши данные', 'Okay, I have received your location'), {reply_markup:{remove_keyboard: true}})
        }
        if (msg.document || msg.photo || msg.audio) {
            return bot.sendMessage(chatId, isRussian(lang, 'Я не понимаю этот документ', 'Ok, I dont understand this doc') )
        }
        if (text === '/loc') {
            return bot.sendLocation(chatId, 53.898886, 27.559028)
        }
        
        return bot.sendMessage(chatId, lang == 'ru' ? 'Я пока не настолько обучен...' : "I'm sorry, but I don't know what you are saying...")
    })
    
    bot.on('callback_query', async (msg) => {
        const data = msg.data
        const chatId = msg.message.chat.id
        const lang = msg.from.language_code
        console.log(msg)

        if (data === '/again') {
            setTimeout(() => {
                bot.deleteMessage(chatId, msg.message.message_id)
            }, 10000)
            // await bot.deleteMessage(chatId, msg.message.message_id - 1)
            return startTheGame(chatId)
        }
        if (data == chats[chatId]) {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp')
            await bot.deleteMessage(chatId, msg.message.message_id)
            return bot.sendMessage(chatId, isRussian(lang, `Поздравляю, ты выиграл! Число - ${chats[chatId]}`, `Great! You won! The number is ${chats[chatId]}`), againOptions)
        } else {
            await bot.deleteMessage(chatId, msg.message.message_id)
            return bot.sendMessage(chatId, isRussian(lang, `Не-а, попробуй еще раз! Твое число - ${data}, загаданное число - ${chats[chatId]}`, `Nope, try again! Your number - ${data}, expected number - ${chats[chatId]}`), againOptions)
        }

        
    })
}

start()
