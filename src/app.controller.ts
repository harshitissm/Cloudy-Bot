import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('weather')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get(':id')
  async getWeatherByCity(@Param('id') id: string) {
    const weatherData = await this.appService.getWeatherByCity(id);
    console.log(`Weather for ${id} is`);
    console.log(weatherData);
    return weatherData;
  }

}
