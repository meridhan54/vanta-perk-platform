
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Perk } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartMatching = async (user: UserProfile, perks: Perk[]) => {
  const prompt = `
    Kullanıcı Profili:
    - Sektör: ${user.sector} - Unvan: ${user.jobTitle} - Katman: ${user.tier}
    Mevcut Yan Haklar: ${JSON.stringify(perks.map(p => ({ id: p.id, title: p.title })))}
    GÖREV: Kullanıcının ${user.tier} katmanına özel, profil bilgilerine göre en uygun 3 yan hakkı seç ve nedenini açıkla.
  `;

  try {
    const response = await ai.models.generateContent({
      // Advanced reasoning task: upgrading to gemini-3-pro-preview
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  perkId: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["perkId", "reason"]
              }
            }
          },
          required: ["matches"]
        }
      }
    });
    // Accessing .text as a property as per current SDK guidelines
    return JSON.parse(response.text || '{"matches": []}');
  } catch (error) {
    return { matches: [] };
  }
};

export const chatAssistant = async (message: string, user: UserProfile) => {
  const prompt = `
    Sen VANTA platformunun akıllı asistanısın. Kullanıcı bilgileri:
    Ad: ${user.fullName}, Katman: ${user.tier}, Bakiye: ${user.balance} TL.
    Kullanıcı mesajı: "${message}"
    Kısa, profesyonel ve yardımcı bir cevap ver. Katman avantajlarını (Gümüş %5, Altın %10 ekstra bonus) vurgula.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Accessing .text as a property
    return response.text;
  } catch (error) {
    return "Şu an cevap veremiyorum, lütfen daha sonra tekrar deneyin.";
  }
};

/**
 * Analyzes sectoral trend data and provides professional insights.
 * Resolves missing export error in TrendDashboard.tsx.
 */
export const getTrendInsights = async (data: any[]) => {
  const prompt = `Aşağıdaki sektörel bazda yan hak kullanım verilerini analiz et ve 1-2 cümlelik profesyonel bir içgörü sağla. 
  Hangi sektörlerde hangi tip harcamaların öne çıktığını belirt:
  ${JSON.stringify(data)}
  `;

  try {
    const response = await ai.models.generateContent({
      // Complex data analysis: using gemini-3-pro-preview
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Trend analysis failed:", error);
    return "Sektörel trendler şu an analiz edilemiyor.";
  }
};
