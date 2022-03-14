
const startMessage = (msg) => {
  return {
    en: `
Welcome, <strong>${msg}</strong> 😀🖐
I am your bot here in telegram and I will provide you with information you might need
My portfolio - lighbe.netlify.app
<i>Telegram profile - @lighbe</i>
  `,
  ru: `
Добро пожаловать, <strong>${msg}</strong> 😀🖐
Я - Lighbe бот 
Мое портфолио - lighbe.netlify.app
<i>Телеграм профиль - @lighbe</i>
  `
  }
}

module.exports = startMessage