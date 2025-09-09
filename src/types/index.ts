export interface UserProfile {
  clima?: string;
  ocasiao?: string;
  cores?: string[];
  estilo?: string;
  orcamento?: string;
  confortoOusadia?: string;
  personalidade?: string;
  cidade?: string;
  estiloDesejado?: string,
  local?: string,
  formalidade?: string,
  preferencias?: string,
  restricoes?: string,
  impacto?: string,
  weatherData?: {
    temperature: number;
    description: string;
    condition: string;
    humidity: number;
    windSpeed: number;
    feelsLike: number;
  };
}

export interface StyleRecommendation {
  id?: string;
  title?: string;
  descricao: string;
  imagens: string[];
  dicas: string[];
  acessorios: string[];
  style?: string;
}

export interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface WeatherData {
  temperature: number;
  description: string;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}