import { FakerAI } from "./faker-ai";

const GenerateData = async () => {
  const app = new FakerAI("YOUR_API_KEY_OPEN_AI");
  const names = (await app.names(10)).getAll();
};

GenerateData();
