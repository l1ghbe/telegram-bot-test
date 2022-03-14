const textToBot = (msg) => {
    return `
<b>From</b>: ${encodeURIComponent(msg.from.first_name)} ${encodeURIComponent('🎈')}
<b>Text</b>: ${msg.text !== undefined ? encodeURIComponent(msg.text) : null}
<b>Document</b>: ${msg.photo ? 'It is an image' : msg.document ? msg.document.mime_type + ', ' + msg.document.file_name : msg.audio ? msg.audio.mime_type + ', ' + msg.audio.file_name : null}
    ${msg.caption ? 'Caption: ' + msg.caption : ''}
<b>Language</b>: ${msg.from.language_code}
<b>Contact</b>: ${msg.contact ? msg.contact.phone_number : null} ${encodeURIComponent('📞')}
<b>Location</b>: ${msg.location ? 'Lat: ' + msg.location.latitude + ', ' + 'Long: ' + msg.location.longitude : null} ${encodeURIComponent('🔍')}
Chat ID: ${encodeURIComponent(msg.chat.id)}
    `
}

module.exports = textToBot