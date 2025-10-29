export interface Voice {
  id: string;
  name: string;
  apiName: string;
  gender: 'male' | 'female' | 'child';
  characteristics: string;
  useCase: string;
}

export interface Tone {
  id: string;
  name: string;
  prompt: string;
}

export interface AudioConfig {
  speed: number;
  toneId: string;
}