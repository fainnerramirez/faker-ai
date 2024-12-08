import { ZodObject } from "zod";

export abstract class ConfigGenerateAI {
  abstract names(count: number): Promise<this>;
  abstract dates(count: number): Promise<this>;
  abstract countries(count: number): Promise<this>;
  abstract cities(count: number): Promise<this>;
  abstract phone_numbers(count: number): Promise<this>;
  abstract emails(count: number): Promise<this>;
  abstract urls(count: number): Promise<this>;
  abstract addresses(count: number): Promise<this>;
  abstract numbers(count: number): Promise<this>;
  abstract values_booleans(count: number): Promise<this>;
  abstract percentages(count: number): Promise<this>;
  abstract sentences(count: number): Promise<this>;
  abstract words(count: number): Promise<this>;
  abstract texts(count: number): Promise<this>;
  abstract uuids(count: number): Promise<this>;
  abstract credit_cards(count: number): Promise<this>;
  abstract ip_addresses(count: number): Promise<this>;
  abstract games(count: number): Promise<this>;
  abstract currencies(count: number): Promise<this>;
  abstract timezones(count: number): Promise<this>;
  abstract getAll(): any;
}
