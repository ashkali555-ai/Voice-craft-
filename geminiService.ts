import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateSpeech(text: string, voiceName: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data received from the API.");
    }
    
    return base64Audio;
  } catch (error) {
    console.error("Error calling Gemini API for speech generation:", error);
    throw new Error("Failed to generate speech. Please check your API key and network connection.");
  }
}

export async function improveTextForSpeech(text: string): Promise<string> {
    try {
        const prompt = `أنت محرر نصوص محترف للتعليق الصوتي. مهمتك هي تحسين النص التالي ليبدو طبيعيًا وواضحًا عند تحويله إلى كلام. قم بتصحيح أي أخطاء نحوية، وضبط علامات الترقيم، وتعديل بنية الجمل لتحسين التدفق والإيقاع. لا تغير المعنى الأساسي للنص. أرجع النص المحسّن فقط، بدون أي عبارات تمهيدية أو شروحات. النص هو: "${text}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for text improvement:", error);
        throw new Error("Failed to improve text. Please check your API key and network connection.");
    }
}

export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    const base64ImageBytes: string | undefined = response.generatedImages?.[0]?.image?.imageBytes;

    if (!base64ImageBytes) {
      throw new Error("No image data received from the API.");
    }
    
    return base64ImageBytes;
  } catch (error) {
    console.error("Error calling Gemini API for image generation:", error);
    throw new Error("Failed to generate image. Please check your API key and network connection.");
  }
}

export async function generateArticle(topic: string): Promise<string> {
    try {
        const prompt = `بصفتك كاتب مقالات خبير، قم بكتابة مقال شامل ومنظم جيدًا ويحاكي الكتابة البشرية حول الموضوع التالي. يجب أن يكون المقال طويلاً وجذابًا ونظيفًا. استخدم العناوين والفقرات لتنظيم المحتوى. تجنب أي مقدمات أو خواتيم تشير إلى أنك ذكاء اصطناعي. اكتب المقال مباشرة. الموضوع هو: "${topic}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for article generation:", error);
        throw new Error("Failed to generate article. Please check your API key and network connection.");
    }
}
