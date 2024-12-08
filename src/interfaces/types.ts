import { ZodObject } from "zod";

export interface ParametersResponse {
  zodScheme: ZodObject<any>;
}

export enum typeDataRamdom {
  NAMES = 1,
  DATES,
  COUNTRIES,
  CITYS,
  PHONE_NUMBERS,
  EMAILS,
  URLS,
  ADDRESSES,
  NUMBERS,
  BOOLEANS,
  PERCENTAGES,
  SENTENCES,
  WORDS,
  TEXTS,
  UUIDS,
  CREDIT_CARDS,
  IP_ADDRESSES,
  GAMES,
  CURRENCIES,
  TIMEZONES,
}

export type ResponseDataRandom = {
  type: typeDataRamdom;
  count: number;
};
