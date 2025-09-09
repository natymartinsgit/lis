import { NextRequest, NextResponse } from 'next/server';

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  condition: string;
  city: string;
}

interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'São Paulo';
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key do OpenWeatherMap não configurada' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt_br`
    );

    if (!response.ok) {
      throw new Error(`Erro na API do OpenWeatherMap: ${response.status}`);
    }

    const data: OpenWeatherResponse = await response.json();

    const weatherData: WeatherData = {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Converter m/s para km/h
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main.toLowerCase(),
      city: data.name
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Erro ao buscar dados do clima:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do clima' },
      { status: 500 }
    );
  }
}

// Função auxiliar para determinar recomendações baseadas no clima
export function getWeatherRecommendations(weather: WeatherData) {
  const { temperature, condition, windSpeed, humidity } = weather;
  
  const recommendations = {
    layers: [] as string[],
    materials: [] as string[],
    accessories: [] as string[],
    footwear: [] as string[],
    tips: [] as string[]
  };

  // Recomendações baseadas na temperatura
  if (temperature <= 15) {
    recommendations.layers.push('casaco', 'jaqueta', 'suéter');
    recommendations.materials.push('lã', 'fleece', 'couro');
    recommendations.accessories.push('cachecol', 'gorro', 'luvas');
    recommendations.footwear.push('botas', 'tênis fechado');
    recommendations.tips.push('Use camadas para se aquecer');
  } else if (temperature <= 25) {
    recommendations.layers.push('cardigan', 'blazer leve');
    recommendations.materials.push('algodão', 'jeans', 'tricot leve');
    recommendations.footwear.push('tênis', 'sapatos fechados', 'botas baixas');
    recommendations.tips.push('Temperatura agradável para looks versáteis');
  } else {
    recommendations.layers.push('camiseta', 'regata', 'vestido leve');
    recommendations.materials.push('linho', 'algodão', 'viscose');
    recommendations.accessories.push('óculos de sol', 'chapéu');
    recommendations.footwear.push('sandálias', 'tênis respirável', 'sapatilhas');
    recommendations.tips.push('Prefira tecidos leves e respiráveis');
  }

  // Recomendações baseadas na condição climática
  if (condition.includes('rain') || condition.includes('drizzle')) {
    recommendations.accessories.push('guarda-chuva', 'capa de chuva');
    recommendations.footwear = ['botas impermeáveis', 'sapatos fechados'];
    recommendations.materials.push('materiais impermeáveis');
    recommendations.tips.push('Evite tecidos que demoram para secar');
  }

  if (condition.includes('snow')) {
    recommendations.layers.push('casaco pesado', 'segunda pele');
    recommendations.accessories.push('cachecol', 'gorro', 'luvas impermeáveis');
    recommendations.footwear = ['botas de neve', 'calçados antiderrapantes'];
    recommendations.tips.push('Proteja extremidades do corpo');
  }

  if (windSpeed > 20) {
    recommendations.tips.push('Evite peças muito soltas devido ao vento');
    recommendations.accessories.push('presilhas para cabelo');
  }

  if (humidity > 80) {
    recommendations.materials.push('tecidos que absorvem umidade');
    recommendations.tips.push('Prefira tecidos respiráveis devido à umidade');
  }

  return recommendations;
}