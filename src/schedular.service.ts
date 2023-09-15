import { Injectable } from '@nestjs/common';

@Injectable()
export class SchedulerService {

    constructor() {

        const schedule = require('node-schedule');

        schedule.scheduleJob('30 9 * * *', async () => {
            await this.sendDailyWeatherUpdates();
        });

    }

    async sendDailyWeatherUpdates() {

        // for (const userId in this.subscriptions) {
        //     const city = this.subscriptions[userId];
        //     try {
        //         const weatherData = await this.appService.getWeatherByCity(city);
        //         bot.sendMessage(userId, `Weather update for ${city}:\nTemp is: ${weatherData.temp}`);
        //     } catch (error) {
        //         console.error(error);
        //         bot.sendMessage(userId, `Error fetching weather update for ${city}.`);
        //     }
        // }

    }

}
