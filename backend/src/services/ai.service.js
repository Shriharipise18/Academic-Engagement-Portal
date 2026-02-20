import Groq from "groq-sdk";

class AIService {
    getGroqClient() {
        if (!this.groq) {
            if (!process.env.GROQ_API_KEY) {
                throw new Error("GROQ_API_KEY is not configured in .env");
            }
            this.groq = new Groq({
                apiKey: process.env.GROQ_API_KEY,
            });
        }
        return this.groq;
    }

    async generateCompletion(prompt, systemPrompt = "You are a helpful academic assistant.") {
        try {
            const groq = this.getGroqClient();

            const completion = await groq.chat.completions.create({
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

    async generateClubDescription(name, tagline = "") {
        const systemPrompt = "You are an expert at writing catchy and professional descriptions for university student clubs. Focus on community building, skill development, and engagement.";
        const prompt = `Write a professional club description for a club named "${name}"${tagline ? ` with the tagline "${tagline}"` : ""}. Max 200 words.`;

        return this.generateCompletion(prompt, systemPrompt);
    }

    async generatePermissionRequest(title) {
        const systemPrompt = "You are an expert at writing formal permission requests for college events. The content should be formal, use professional language, and be clearly structured for authorities to review.";
        const prompt = `Write a detailed formal permission request description for: "${title}". It should explain the purpose and necessity of the event.`;

        return this.generateCompletion(prompt, systemPrompt);
    }

    async generateSOP(clubName, studentName = "a student") {
        const systemPrompt = "You are a helpful assistant assisting a student in writing a short, passionate 'Statement of Purpose' to join a college club. Keep it around 100-150 words, enthusiastic and sincere.";
        const prompt = `Write a statement of purpose for ${studentName} who wants to join the "${clubName}" club. Explain interest in the club's activities and desire to contribute.`;

        return this.generateCompletion(prompt, systemPrompt);
    }

    async generateRemarks(subject, action = "approve") {
        const systemPrompt = "You are a university administrator writing professional remarks for an event permission request. Keep it formal and brief (1-2 sentences).";
        const prompt = `Write a professional ${action} remark for the event request: "${subject}".`;

        return this.generateCompletion(prompt, systemPrompt);
    }
}

export default new AIService();
