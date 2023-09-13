import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }

  async getWeather() {
    const url = 'https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=Delhi&country=India';

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '07c35b8f44msh20b400e144af541p1e3604jsn684455a67341',
        'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
      }
    };

    try {
      const fetch = require('node-fetch');
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getWeatherByCity(city: string) {
    city = city.replace(/ /g, "%20");
    const url = 'https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city='+city;

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '07c35b8f44msh20b400e144af541p1e3604jsn684455a67341',
        'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}
