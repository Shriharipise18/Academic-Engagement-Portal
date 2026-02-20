import aiService from "../services/ai.service.js";

export const generateContent = async (req, res, next) => {
    const { title, name, tagline, clubName, studentName, subject, action, type } = req.body;

    try {
        let result;
        if (type === "permission") {
            result = await aiService.generatePermissionRequest(title);
        } else if (type === "club") {
            result = await aiService.generateClubDescription(name, tagline);
        } else if (type === "sop") {
            result = await aiService.generateSOP(clubName, studentName);
        } else if (type === "remarks") {
            result = await aiService.generateRemarks(subject, action);
        } else {
            result = await aiService.generateFormDescription(title, type);
        }

        res.json({ content: result });
    } catch (error) {
        next(error);
    }
};

export const chat = async (req, res, next) => {
    const { prompt, history } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
    }

    try {
        const systemPrompt = "You are an AI assistant for the Academic Engagement Portal. You help students, club heads, and faculty with portal features, writing requests, and providing information about clubs and events.";
        const result = await aiService.generateCompletion(prompt, systemPrompt);
        res.json({ response: result });
    } catch (error) {
        next(error);
    }
};
