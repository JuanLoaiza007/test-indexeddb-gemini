import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_ROL } from "../config/gemini";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: GEMINI_ROL,
});

const generationConfig = {
  temperature: 2,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function request_gemini(transacciones) {
  const now = Date.now();
  const limiteSolicitudes = 2;
  const ventanaTiempo = 60 * 1000; // 1 minuto

  const historial = JSON.parse(localStorage.getItem("ia_request_log")) || [];

  const recientes = historial.filter(
    (timestamp) => now - timestamp < ventanaTiempo
  );

  if (recientes.length >= limiteSolicitudes) {
    return `Has alcanzado el límite de ${limiteSolicitudes} solicitudes por minuto. Inténtalo más tarde.`;
  }

  recientes.push(now);
  localStorage.setItem("ia_request_log", JSON.stringify(recientes));

  const prompt = `
${JSON.stringify(transacciones, null, 2)}
Analiza estas transacciones y sugiere al usuario.
`;

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  try {
    console.log("La IA esta pensando...");
    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();
    console.log("Gemini:", responseText);
    console.log("La IA ha terminado de pensar.");
    return responseText;
  } catch (error) {
    console.error("Error al obtener respuesta de Gemini:", error);
    return "Hubo un error al procesar la solicitud de IA.";
  }
}
