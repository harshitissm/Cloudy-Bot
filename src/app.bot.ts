import { Injectable } from "@nestjs/common";
import { AppService } from "./app.service";

@Injectable()
export class AppBot {

    private chatStates: Record<string, string> = {}; // Stores the state of the conversation for each chat

    constructor(private readonly appService: AppService) {
        const TelegramBot = require('node-telegram-bot-api');
        const token = '6605906683:AAEH49Juc57pUYaUiD8r8Hq5hUHnRBx2Txs';
        const bot = new TelegramBot(token, { polling: true });

        bot.on('message', async (msg) => {
            const chatId = msg.chat.id;
            const messageText : string = msg.text;

            if(messageText && (messageText.startsWith('Hi') || messageText.startsWith('Hello') || messageText.startsWith('/start'))){
                bot.sendMessage(chatId, 'Hello, Welcome to Cloudy\nPlease use /weather command to get weather for your state');
            }
            else if (messageText && (messageText.startsWith('/weather'))) {
                // Set the state to 'awaitingCity'
                this.chatStates[chatId] = 'awaitingCity';
                bot.sendMessage(chatId, 'Please provide a city for weather information.');

            } else if (this.chatStates[chatId] === 'awaitingCity') {
                // User has provided the city
                const city = messageText;
                console.log(city);
                delete this.chatStates[chatId]; // Clear the state
                try {
                    const response = await this.appService.getWeatherByCity(city);
                    const newObj: any = response;
                    bot.sendMessage(chatId, `Temperature in ${city}: ${newObj.temp}°C\nFeels Like: ${newObj.feels_like}°C`);
                    bot.sendMessage(chatId, 'Use /weather command to get weather for another state');
                } catch (error) {
                    console.error(error);
                    bot.sendMessage(chatId, 'Sorry, there was an error fetching weather data.');
                }
            }
        });

        
    }
}

