const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Token
const telegramToken = 'TOKEN';

// Bot
const bot = new TelegramBot(telegramToken, { polling: true });

// IQAir
const iqAirApiKey = 'API_KEY';
const iqAirBaseUrl = 'https://api.airvisual.com/v2/city';
const state = 'Central Serbia';
const state2 = 'Autonomna Pokrajina Vojvodina'
const country = 'Serbia'

let airMsg = '';

function iqCheck(airQuality) {

if (airQuality > 0 && airQuality <= 50) {
    airMsg = `Good. You can enjoy your usual outdoor activities. You may choose to open your windows and ventilate your home to bring in outdoor air.`
    return airMsg
    } else if (airQuality > 50 && airQuality <= 100) {
    airMsg = `Moderate. Due to the risk of respiratory illness symptoms, sensitive groups should greatly reduce outdoor exercise when air quality is moderate (AQI 51-100). Avoid ventilating indoor spaces with outdoor air, and close windows to avoid letting outdoor air pollution indoors.\n\nNote that sensitive groups for all categories include children, the elderly, pregnant people, and people with cardiac and pulmonary diseases. `
    return airMsg
    } else if (airQuality > 100 && airQuality <= 150) {
    airMsg = `Unhealthy for Sensitive Groups. When air quality is unhealthy for sensitive groups, everyone is at risk for eye, skin, and throat irritation as well as respiratory problems. The public should greatly reduce outdoor exertion.\n\nSensitive groups are at greater health risk, should avoid all outdoor activity, and should consider wearing an air pollution mask outdoors. Ventilation is discouraged. A high-performance air purifier should be turned on if indoor air quality is unhealthy.`
    return airMsg
    } else if (airQuality > 150 && airQuality <= 200) {
    airMsg = `Unhealthy. Unhealthy AQI measurements mean that there is an increased likelihood of heart and lung aggravation as well as health impacts among the public, particularly for sensitive groups.\n\nEveryone should avoid and wear a pollution mask outdoors. Ventilation is discouraged. Air purifiers should be turned on.`
    return airMsg
    } else if (airQuality > 200 && airQuality <= 300) {
    airMsg = `Very unhealthy. When air quality is very unhealthy, the public will be noticeably affected. Sensitive groups will experience reduced endurance in activities. These individuals should remain indoors and limit activities.\n\nEveryone should avoid outdoor exercise and wear a pollution mask outdoors. Ventilation is discouraged. Air purifiers should be turned on.`
    return airMsg
    } else if (airQuality > 300) {
    airMsg = `Hazardous. Everyone is at high risk of experiencing strong irritation and negative health effects that could trigger cardiovascular and respiratory illnesses.\n\nAvoid exercise and remain indoors. Avoid outdoor exercise and wear a pollution mask outdoors. Ventilation is discouraged. Air purifiers should be turned on.`
    return airMsg
    }
}

}

// /start handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      keyboard: [
        ['Belgrade'],
        ['Novi Sad'],
        ['Niš']
      ],
      one_time_keyboard: true,
    },
  };

  bot.sendMessage(chatId, 'Please select a city:', options);
});

// Cities handlers
bot.onText(/^(Belgrade|Niš)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const city = match[0];

    if (city != 'Niš') {
    try {
      const response = await axios.get(`${iqAirBaseUrl}?city=${city}&state=${state}&country=${country}&key=${iqAirApiKey}`);
      const airQuality = response.data.data.current.pollution.aqius;

      airMsg = ''
      iqCheck(airQuality)

      bot.sendMessage(chatId, `The current air quality in ${city} is ${airQuality}.\n\n${airMsg}`);
    } catch (error) {
      console.log(error);
      bot.sendMessage(chatId, 'Oops! Something went wrong.');
    }
 } else {
    try {
        const response = await axios.get(`${iqAirBaseUrl}?city=Nis&state=${state}&country=${country}&key=${iqAirApiKey}`);
        const airQuality = response.data.data.current.pollution.aqius;

        airMsg = ''
        iqCheck(airQuality)

        bot.sendMessage(chatId, `The current air quality in ${city} is ${airQuality}.\n\n${airMsg}`);
      } catch (error) {
        console.log(error);
        bot.sendMessage(chatId, 'Oops! Something went wrong.');
      }
 }
 })
 bot.onText(/^(Novi Sad)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const city = match[0];

    try {
      const response = await axios.get(`${iqAirBaseUrl}?city=${city}&state=${state2}&country=${country}&key=${iqAirApiKey}`);
      const airQuality = response.data.data.current.pollution.aqius;

      airMsg = ''
      iqCheck(airQuality)

      bot.sendMessage(chatId, `The current air quality in ${city} is ${airQuality}.\n\n${airMsg}`);
    } catch (error) {
      console.log(error);
      bot.sendMessage(chatId, 'Oops! Something went wrong.');
    }
  });

// Start the bot
bot.on('polling_error', (error) => {
  console.log(error);
});

console.log('Bot is running...');
