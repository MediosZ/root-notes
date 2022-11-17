const crypto = require('crypto')

const get4DigitsCode = (message) => {
    const hash = crypto
        .createHmac('sha256', Buffer.from("SECRET", 'hex'))
        .update(message)
        .digest('hex');
    return hash;
};

console.log(get4DigitsCode("hello"));
