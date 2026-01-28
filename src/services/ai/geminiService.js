export const callGeminiAI = async (userPrompt, contextData, ivaRate) => {
  // Verificar si hay API key configurada
  // @ts-ignore - Variable global definida en vite.config.js o .env
  const apiKey = typeof __gemini_api_key !== 'undefined' ? __gemini_api_key : '';
  
  // Si no hay API key, retornar mensaje informativo
  if (!apiKey || apiKey.trim() === '') {
    return { 
      text: "⚠️ El asistente de IA requiere una API key de Gemini para funcionar. Por favor, configura tu API key en el archivo de configuración. Mientras tanto, puedes usar todas las demás funciones de la aplicación para analizar y comparar proveedores.", 
      sources: [] 
    };
  }

  const model = "gemini-2.5-flash-preview-09-2025";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: String(userPrompt) }] }],
        systemInstruction: { 
          parts: [{ 
            text: `Eres un analista de compras experto. Datos: ${JSON.stringify(contextData)}. Tasa IVA: ${ivaRate}%. Ayuda al usuario con comparativas y ahorro.` 
          }] 
        },
        tools: [{ "google_search": {} }]
      })
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      if (response.status === 403) {
        return { 
          text: "⚠️ Error de autenticación con la API de Gemini. Por favor, verifica que tu API key sea válida y tenga los permisos necesarios.", 
          sources: [] 
        };
      }
      if (response.status === 400) {
        return { 
          text: "⚠️ Error en la solicitud a la API de Gemini. Por favor, intenta reformular tu pregunta.", 
          sources: [] 
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude procesar tu solicitud.";
    const sources = result.candidates?.[0]?.groundingMetadata?.groundingAttributions?.map(a => ({ 
      uri: a.web?.uri, 
      title: a.web?.title 
    })) || [];
    
    return { text: textResponse, sources };
  } catch (e) {
    console.error('Error en Gemini AI:', e);
    return { 
      text: "⚠️ Error de conexión con el asistente de IA. Por favor, verifica tu conexión a internet o intenta más tarde.", 
      sources: [] 
    };
  }
};
