const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

(async () => {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [{ role: "user", content: "Hola, ¿funciona esta clave?" }],
    });
    console.log("Respuesta del modelo:", completion.choices[0].message.content);
  } catch (error) {
    console.error("Error en la prueba:", error.message);
  }
})();
