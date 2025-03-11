import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function request_gemini(transacciones) {
  const prompt = `
    Eres un analista financiero especializado en el análisis de ingresos y gastos personales. 
    Tu tarea es revisar la lista de transacciones proporcionada y ofrecer recomendaciones 
    prácticas para mejorar la gestión del dinero. 

    Reglas de tu respuesta:
    - Analiza patrones de gasto y ahorro.
    - No te centres en optimizar los gastos "escenciales", intenta optimizar los "opcionales".
    - Sugiere formas de optimizar los ingresos y reducir gastos innecesarios.
    - No hagas suposiciones fuera de los datos dados.
    - Responde en un solo párrafo con consejos concisos y aplicables.

    Aquí está la lista de transacciones:
    ${JSON.stringify(transacciones, null, 2)}
    `;

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  try {
    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();
    console.log("Gemini:", responseText);
    return responseText;
  } catch (error) {
    console.error("Error al obtener respuesta de Gemini:", error);
    return "Hubo un error al procesar la solicitud de IA.";
  }
}
