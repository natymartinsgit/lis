import { NextRequest, NextResponse } from 'next/server';

interface GeocodingResponse {
  city?: string;
  country?: string;
  state?: string;
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude e longitude são obrigatórias' },
        { status: 400 }
      );
    }

    // Primeiro, tentar com a API do OpenWeatherMap (mais precisa)
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (apiKey) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const result: GeocodingResponse = {
              city: data[0].name,
              country: data[0].country,
              state: data[0].state
            };
            console.log('OpenWeatherMap geocoding result:', result);
            return NextResponse.json(result);
          }
        }
      } catch (error) {
        console.error('Erro na API do OpenWeatherMap:', error);
      }
    }

    // Fallback: usar Nominatim (OpenStreetMap)
    try {
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Lookia-App/1.0'
          }
        }
      );
      
      if (nominatimResponse.ok) {
        const nominatimData = await nominatimResponse.json();
        console.log('Nominatim data:', nominatimData);
        
        const city = nominatimData.address?.city || 
                    nominatimData.address?.town || 
                    nominatimData.address?.village || 
                    nominatimData.address?.municipality ||
                    nominatimData.address?.county ||
                    nominatimData.address?.state_district;
                    
        const country = nominatimData.address?.country;
        const state = nominatimData.address?.state;
        
        const result: GeocodingResponse = {
          city,
          country,
          state
        };
        
        console.log('Nominatim geocoding result:', result);
        return NextResponse.json(result);
      }
    } catch (error) {
      console.error('Erro na API do Nominatim:', error);
    }

    return NextResponse.json(
      { error: 'Não foi possível obter informações de localização' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Erro no geocoding:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}