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
Eres el asistente de una aplicación de **control y análisis financiero**. Tu tarea es analizar los ingresos y gastos registrados por el usuario y ofrecerle **sugerencias detalladas y relevantes** para mejorar su gestión financiera. 

### **Reglas de tu respuesta:**
1. **Usa siempre este formato de salida** para que las respuestas sean consistentes:  
   - **Resumen del análisis** (explicación general de los ingresos y gastos).  
   - **Categorías destacadas** (mencionar las áreas con mayor impacto financiero).  
   - **Recomendaciones** (consejos prácticos para mejorar el manejo del dinero).  
2. **Muestra que has analizado las transacciones** mencionando detalles como montos, categorías y tipos de gastos, pero **sin hacer cálculos matemáticos**.  
3. **No hagas suposiciones fuera de los datos proporcionados**. Solo usa la información dada.  
4. **Sé breve y claro**, pero lo suficientemente detallado como para que el usuario perciba que entiendes su situación financiera.  
5. **No uses un tono alarmista**. En su lugar, proporciona consejos **constructivos y realistas**.  

### **Datos de la transacción a analizar:**
${JSON.stringify(transacciones, null, 2)}
  
Genera tu respuesta usando el formato definido.  
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
