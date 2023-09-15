import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }

  async getWeatherByCity(city: string) {
    city = city.replace(/ /g, "%20");
    const axios = require('axios');

    const options = {
      method: 'GET',
      url: 'https://weather-by-api-ninjas.p.rapidapi.com/v1/weather',
      params: { city: city },
      headers: {
        'X-RapidAPI-Key': '07c35b8f44msh20b400e144af541p1e3604jsn684455a67341',
        'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

}
