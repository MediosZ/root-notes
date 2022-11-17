const crypto = require('crypto');


const getHash = (message) => {
  const hash = crypto
      .createHmac('sha256', Buffer.from("SECRET", 'hex'))
      .update(message)
      .digest('hex');

  return hash.slice(0, 24);
};


module.exports = {
  getHash
}


