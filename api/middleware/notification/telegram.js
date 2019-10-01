'use strict';

const fetch = require('node-fetch');
const telegramConfigs = require(`${__dirname}/../../configs/telegram.json`);

module.exports.sendViaTelegram = async (message) => {
  for (let id of telegramConfigs.chats) {
    let response = await fetch(`https://api.telegram.org/bot${telegramConfigs.bot_token}/sendMessage?chat_id=${id}&text=${message}&parse_mode=${telegramConfigs.parse_mode}`);
    let data = await response.json();

    if (data.ok === true) {
      return true;
    } else {
      return false;
    }
  }
};
