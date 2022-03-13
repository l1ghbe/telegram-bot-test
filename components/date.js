const time = new Date()
const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const currentDateAndTime = `
${days[time.getDay()]}
${months[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}
${time.getHours()}:${time.getMinutes()}
`

module.exports = currentDateAndTime