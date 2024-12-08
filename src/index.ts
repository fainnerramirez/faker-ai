import { FakerAI } from "./faker-ai";

const GenerateData = async () => {
  const app = new FakerAI("YOUR_API_KEY_OPEN_AI");
  const names = (await app.setLanguageResponse("es_ES").names(10)).generate();
};

GenerateData();
