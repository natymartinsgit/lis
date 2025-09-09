'use client';

import React, { useState, useEffect } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  weatherData?: {
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    feelsLike: number;
    condition: string;
    city: string;
  };
}

interface LocationDetectorProps {
  onLocationDetected: (location: LocationData) => void;
  onError?: (error: string) => void;
}

const LocationDetector: React.FC<LocationDetectorProps> = ({
  onLocationDetected,
  onError
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Verificar se a geolocalização é suportada
  const isGeolocationSupported = () => {
    return isClient && 'geolocation' in navigator;
  };

  // Função para obter o nome da cidade através de reverse geocoding
  const getCityFromCoordinates = async (lat: number, lon: number): Promise<{ city?: string; country?: string }> => {
    try {
      // Usar nossa API route de geocoding
      const response = await fetch(`/api/geocoding?lat=${lat}&lon=${lon}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Dados do geocoding:', data); // Debug
        
        if (data.city && data.country) {
          console.log('Cidade detectada:', data.city, 'País:', data.country); // Debug
          return {
            city: data.city,
            country: data.country
          };
        }
      } else {
        console.error('Erro na API de geocoding:', response.status);
      }
      
      return {};
    } catch (error) {
      console.error('Erro ao obter cidade:', error);
      return {};
    }
  };

  // Detectar localização
  const detectLocation = () => {
    if (!isGeolocationSupported()) {
      const error = 'Geolocalização não é suportada neste navegador';
      onError?.(error);
      return;
    }

    setIsDetecting(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutos
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const { city, country } = await getCityFromCoordinates(latitude, longitude);
          
          // Buscar dados do clima
          let weatherData = null;
          if (city) {
            try {
              const weatherResponse = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
              if (weatherResponse.ok) {
                weatherData = await weatherResponse.json();
              }
            } catch (weatherError) {
              console.error('Erro ao buscar dados do clima:', weatherError);
            }
          }
          
          const location: LocationData = {
            latitude,
            longitude,
            city,
            country,
            weatherData
          };
          
          setLocationData(location);
          onLocationDetected(location);
          setHasPermission(true);
        } catch (error) {
          console.error('Erro ao processar localização:', error);
          onError?.('Erro ao processar dados de localização');
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        setHasPermission(false);
        
        let errorMessage = 'Erro ao obter localização';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada pelo usuário';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informações de localização não disponíveis';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo limite para obter localização excedido';
            break;
        }
        
        onError?.(errorMessage);
      },
      options
    );
  };

  // Verificar se está no cliente e permissão de localização
  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined' && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setHasPermission(result.state === 'granted');
      });
    }
  }, []);

  return (
    <div className="location-detector bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📍</span>
          <div>
            <h3 className="font-semibold text-gray-800">Localização Automática</h3>
            <p className="text-sm text-gray-600">Para clima em tempo real</p>
          </div>
        </div>
        
        {locationData && (
          <div className="text-right">
            <p className="text-sm font-medium text-green-600">✅ Detectado</p>
            <p className="text-xs text-gray-500">
              {locationData.city}{locationData.country && `, ${locationData.country}`}
            </p>
          </div>
        )}
      </div>

      {!locationData && (
        <div className="space-y-3">
          {hasPermission === false && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm">
              ⚠️ Permissão de localização necessária para clima automático
            </div>
          )}
          
          <button
            onClick={detectLocation}
            disabled={isDetecting || !isGeolocationSupported()}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDetecting ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Detectando localização...
              </>
            ) : (
              <>🌍 Detectar Minha Localização</>
            )}
          </button>
          
          {isClient && !isGeolocationSupported() && (
            <p className="text-xs text-red-500 text-center">
              Geolocalização não suportada neste navegador
            </p>
          )}
        </div>
      )}
      
      {locationData && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Coordenadas:</span>
            <span className="text-xs text-gray-500 font-mono">
              {locationData.latitude.toFixed(4)}, {locationData.longitude.toFixed(4)}
            </span>
          </div>
          
          <button
            onClick={detectLocation}
            disabled={isDetecting}
            className="mt-2 w-full bg-gray-500 text-white py-1 px-3 rounded text-sm hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            🔄 Atualizar Localização
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationDetector;