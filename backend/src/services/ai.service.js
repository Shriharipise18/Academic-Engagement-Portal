import Groq from "groq-sdk";

class AIService {
    constructor() {
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
    }

    async generateCompletion(prompt, systemPrompt = "You are a helpful academic assistant.") {
        try {
            if (!process.env.GROQ_API_KEY) {
                throw new Error("GROQ_API_KEY is not configured in .env");
            }

            const completion = await this.groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt },
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                max_tokens: 1024,
            });

            return completion.choices[0]?.message?.content || "";
        } catch (error) {
            console.error("Groq AI Error:", error);
            throw error;
        }
    }

    async generateFormDescription(title, type = "event") {
        const systemPrompt = "You are an expert at writing formal academic descriptions for university clubs and events. Keep the tone professional, engaging, and concise (max 150 words).";
        const prompt = `Write a professional description for a ${type} titled: "${title}". Include key details that would typically be expected in a college setting.`;

        return this.generateCompletion(prompt, systemPrompt);
    }

    async generatePermissionRequest(title) {
        const systemPrompt = "You are an expert at writing formal permission requests for college events. The content should be formal, use professional language, and be clearly structured for authorities to review.";
        const prompt = `Write a detailed formal permission request description for: "${title}". It should explain the purpose and necessity of the event.`;

        return this.generateCompletion(prompt, systemPrompt);
    }
}

export default new AIService();
