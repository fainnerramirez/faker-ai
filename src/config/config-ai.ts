import { ZodObject } from "zod";

export abstract class ConfigAI {
  abstract Run(): Promise<void>;
  abstract getCompletionResponse(): any;
}
