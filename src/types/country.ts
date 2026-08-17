export interface CountryCurrency {
  code: string;
  name: string;
  symbol: string;
}

export interface CountryLanguage {
  iso639_1?: string;
  iso639_2?: string;
  name: string;
  nativeName?: string;
}

export interface CountryFlags {
  svg: string;
  png: string;
}

export interface CountryMaps {
  googleMaps: string;
  openStreetMaps: string;
}

export interface Country {
  name: string;
  nativeName?: string;
  topLevelDomain?: string[];
  alpha2Code: string;
  alpha3Code: string;
  callingCodes?: string[];
  capital?: string;
  altSpellings?: string[];
  subregion?: string;
  region: string;
  population: number;
  latlng?: number[];
  demonym?: string;
  area: number;
  timezones?: string[];
  borders?: string[];
  numericCode?: string;
  flags: CountryFlags;
  currencies?: CountryCurrency[];
  languages?: CountryLanguage[];
  flag?: string;
  maps?: CountryMaps;
  populationDensity?: number;
}

export interface ContinentConfig {
  name: string;
  nameUz: string;
  region: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  route: string;
  facts: string[];
}

export interface QuizQuestion {
  id: string;
  type: 'flag' | 'capital' | 'currency' | 'continent';
  question: string;
  correctAnswer: string;
  options: string[];
}
