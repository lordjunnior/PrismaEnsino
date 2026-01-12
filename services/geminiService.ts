import { GoogleGenAI, Modality } from "@google/genai";

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const geminiService = {
  async generateActivity(params: {
    age: number;
    grade?: string;
    objective: string;
    estimatedTime: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  }) {
    const ai = getAI();
    const prompt = `Crie uma atividade pedagógica adequada para uma criança de ${params.age} anos. Objetivo: ${params.objective}. Tempo: ${params.estimatedTime}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Você é um assistente pedagógico profissional. Responda em Português com tom afetuoso.",
      },
    });

    return response.text;
  },

  async generateLessonPlan(params: {
    theme: string;
    objective: string;
    ageRange: string;
    estimatedTime: string;
  }) {
    const ai = getAI();
    const prompt = `Gere um PLANO DE AULA COMPLETO. Tema: ${params.theme}. Objetivo: ${params.objetivo}. Faixa Etária: ${params.ageRange}. Duração: ${params.estimatedTime}.
    Inclua: Introdução, Desenvolvimento, Atividade Prática, Avaliação e Materiais Necessários.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Você é um assistente pedagógico. Crie planos de aula estruturados, alinhados à BNCC e com foco no desenvolvimento integral da criança.",
      },
    });

    return response.text;
  },

  async generateStory(params: {
    mode: 'educational' | 'sleep';
    age: number;
    theme: string;
    message?: string;
    charName?: string;
    duration?: 'curta' | 'média';
  }) {
    const ai = getAI();
    
    let prompt = "";
    if (params.mode === 'educational') {
      prompt = `Crie uma história infantil EDUCATIVA para uma criança de ${params.age} anos. 
      Tema: ${params.theme}. 
      Mensagem desejada: ${params.message || 'Valores positivos e curiosidade'}.
      Nome do personagem: ${params.charName || 'um amiguinho especial'}.
      
      Requisitos: Linguagem simples, frases fluidas, ritmo para leitura em voz alta.`;
    } else {
      prompt = `Crie uma história infantil para RELAXAR E DORMIR para uma criança de ${params.age} anos. 
      Tema: ${params.theme}. 
      Nome do personagem: ${params.charName || 'um amiguinho tranquilo'}.
      Duração: ${params.duration || 'média'}.
      
      Requisitos: Ritmo lento, frases curtas, palavras tranquilizadoras (calmo, quentinho, repousar), sem conflitos.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `Você é um contador de histórias especialista em infância.
        DIRETRIZES DE SEGURANÇA EMOCIONAL (OBRIGATÓRIO):
        - NUNCA inclua: medo, violência, abandono, morte, vilões assustadores ou conflitos intensos.
        - NUNCA use linguagem agressiva ou moral pesada.
        - Sempre foque em final positivo, sensação de segurança e acolhimento.
        - Use pausas suaves (...) para marcar o ritmo.
        - NUNCA mencione o nome de nenhuma plataforma, aplicativo ou ferramenta.`,
        temperature: 0.7,
      },
    });

    return response.text;
  },

  async generateVisualMaterial(params: {
    theme: string;
    age: number;
    objective: string;
  }) {
    const ai = getAI();
    const prompt = `Descreva um material visual pedagógico detalhado para o tema: "${params.theme}" para uma criança de ${params.age} anos. 
    Objetivo: ${params.objective}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `Aja exclusivamente como um módulo de criação de material visual educativo. 
        Ao receber um tema e uma idade, sua função é:
        - Descrever detalhadamente um material visual pedagógico.
        - O visual deve ser limpo e organizado.
        - Use cores suaves e harmônicas.
        REGRA DE OURO: Não crie atividades textuais. Não crie histórias. Descreva apenas a composição visual.`,
        temperature: 0.4,
      },
    });

    return response.text;
  },

  async adjustActivityLevels(params: {
    originalActivity: string;
    age: number;
  }) {
    const ai = getAI();
    const prompt = `Ajuste esta atividade para a idade de ${params.age} anos, criando três versões: Fácil, Intermediária e Avançada.
    Atividade original: ${params.originalActivity}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `Aja exclusivamente como um módulo de ajuste de níveis pedagógicos. Adapte a atividade fornecida mantendo seu objetivo original, com linguagem simples e acolhedora.`,
        temperature: 0.7,
      },
    });

    return response.text;
  },

  async generateParentSummary(params: {
    age: number;
    weekWork: string;
    highlights: string;
    observations?: string;
  }) {
    const ai = getAI();
    const prompt = `Gere um resumo para pais baseado no seguinte:
    Idade da criança: ${params.age} anos
    O que foi trabalhado: ${params.weekWork}
    Destaques da semana: ${params.highlights}
    Observações: ${params.observations || 'Nenhuma'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `Aja exclusivamente como um módulo de comunicação para pais e responsáveis.
        Sua função é:
        - Receber informações sobre o trabalho pedagógico e transformá-las em um resumo claro e afetuoso.
        - Usar linguagem 100% acessível, eliminando termos técnicos ou acadêmicos.
        - Manter um tom caloroso, que transmita segurança e parceria.
        - Sugerir uma forma leve de os pais acompanharem o assunto em casa.
        - REGRA DE OURO: Não gere atividades formais para os pais fazerem. Foco total no bem-estar e progresso da criança.`,
        temperature: 0.6,
      },
    });

    return response.text;
  },

  async generateNarrationText(text: string) {
    const ai = getAI();
    const prompt = `Adapte o seguinte texto para um roteiro de narração em áudio: ${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `Aja exclusivamente como um módulo de narração em áudio educativo. Transforme o texto em roteiro humano, com pausas (...) e tom acolhedor.`,
        temperature: 0.6,
      },
    });

    return response.text;
  },

  async getAudioBuffer(text: string, context: AudioContext, isNarration: boolean = false, isSleepy: boolean = false): Promise<AudioBuffer | null> {
    const ai = getAI();
    let instruction = `Com uma voz doce e clara, narre este texto pedagógico: ${text.substring(0, 1500)}`;
    
    if (isSleepy) {
        instruction = `Narre este conto de dormir com a voz mais calma e relaxante: ${text.substring(0, 1500)}`;
    } else if (isNarration) {
        instruction = `Narre este texto como um contador de histórias carinhoso: ${text.substring(0, 1500)}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ parts: [{ text: instruction }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return await decodeAudioData(decode(base64Audio), context, 24000, 1);
    }
    return null;
  }
};
