import { Injectable } from "@nestjs/common";
import { AppService } from "./app.service";
import { MongoDBService } from "./mongo.service";

@Injectable()
export class AppBot {

    private chatStates: Record<string, string> = {}; // Stores the state of the conversation for each chat
    private subscriptions: Record<string, string> = {};

    constructor(private readonly appService: AppService, private readonly mongoDbService: MongoDBService) {
        const TelegramBot = require('node-telegram-bot-api');
        const token = '6605906683:AAEH49Juc57pUYaUiD8r8Hq5hUHnRBx2Txs';
        const bot = new TelegramBot(token, { polling: true });

        bot.on('message', async (msg) => {
            const chatId = msg.chat.id;
            const messageText = msg.text;

            if (messageText && (messageText.startsWith('Hi') || messageText.startsWith('Hello') || messageText.startsWith('/start'))) {
                delete this.chatStates[chatId];
                bot.sendMessage(chatId, 'Hello, Welcome to Cloudy\nPlease use /weather command to get weather for your state');
            }
            else if (messageText && (messageText.startsWith('/delete'))){

                const city = await this.mongoDbService.getUserSubscription(chatId);
                if(city){
                    await this.mongoDbService.deleteUserSubscription(chatId);
                    bot.sendMessage(chatId, `Your Subscription for weather updates for city: ${city} is now deleted`);
                }
                else{
                    bot.sendMessage(chatId, 'You have not subscribed for weather updates. Please use /subscribe to get weather updates for your city');
                }
            }
            else if (messageText && (messageText.startsWith('/weather'))) {
                // Set the state to 'awaitingCity'
                this.chatStates[chatId] = 'awaitingCity';
                bot.sendMessage(chatId, 'Please provide a city for weather information.');

            }else if (messageText && (messageText.startsWith('/subscribe'))) {
                // Set the state to 'awaitingSubscription'
                this.chatStates[chatId] = 'awaitingSubscription';
                const city = await this.mongoDbService.getUserSubscription(chatId);
                if(city){
                    // const city = this.subscriptions[chatId];
                    bot.sendMessage(chatId, `You have already subscribed to city ${city} for weather updates. Entering new city will update your subscribed city`);
                    setTimeout(() => {
                        bot.sendMessage(chatId, 'If you wish to continue, then please enter the new city else /start again');
                    }, 1000);
                }else{
                    bot.sendMessage(chatId, 'Please enter the city you want to subscribe to (e.g., New York).');
                }
            } else if (this.chatStates[chatId] === 'awaitingCity') {
                // User has provided the city
                const city = messageText;
                delete this.chatStates[chatId]; // Clear the state
                try {
                    const response = await this.appService.getWeatherByCity(city);
                    const newObj: any = response;
                    bot.sendMessage(chatId, `Temperature in ${city}: ${newObj.temp}°C\nFeels Like: ${newObj.feels_like}°C`);
                    setTimeout(() => {
                        bot.sendMessage(chatId, 'Use /weather command to get weather for another state');                        
                    }, 1000);
                } catch (error) {
                    console.error(error);
                    bot.sendMessage(chatId, 'Sorry, there was an error fetching weather data.');
                }
            }
            else if (this.chatStates[chatId] === 'awaitingSubscription') {

                const cityToSubscribe = messageText;
                // this.subscriptions[chatId] = cityToSubscribe;  // Store the user's subscription
                await this.mongoDbService.addUserSubscription(chatId, cityToSubscribe);
                delete this.chatStates[chatId]; // Clear the state
                bot.sendMessage(chatId, `You are now subscribed to daily weather updates for ${cityToSubscribe}.`);
            }
        });

        const schedule = require('node-schedule');
        schedule.scheduleJob('7 9 * * *', async () => {
            for (const userId in this.subscriptions) {
                // const city = this.subscriptions[userId];
                const city = await this.mongoDbService.getUserSubscription(userId);
                try {
                    const weatherData = await this.appService.getWeatherByCity(city);
                    bot.sendMessage(userId, `Weather update for ${city}:\nTemp is: ${weatherData.temp}`);
                } catch (error) {
                    console.error(error);
                    bot.sendMessage(userId, `Error fetching weather update for ${city}.`);
                }
            }
        });
    }
}

