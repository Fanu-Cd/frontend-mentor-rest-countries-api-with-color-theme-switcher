export interface Country {
  name: {
    common: string;
    nativeName: {
      eng: {
        official: string;
      };
    };
  };
  flags: {
    svg: string;
  };
  population: number;
  region: string;
  subregion: string;
  capital: string | string[];
  tld: string | string[];
  currencies: {
    [currencyCode: string]: {
      name: string;
    };
  };
  languages: {
    [code: string]: string;
  };
  borders: string[];
  cca3: string;
}
