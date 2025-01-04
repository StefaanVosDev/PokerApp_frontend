const apiKey: string = import.meta.env.VITE_GEMINI_API_KEY;
const apiUrl: string = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

/**
 * Sends a message to the Gemini API and retrieves the bot's response.
 * @param userMessage The user's message.
 * @returns The bot's response.
 */
export const fetchChatBotResponse = async (userMessage: string): Promise<string> => {
    const systemInstruction =
        "You are an expert in poker. Only answer questions related to poker. If the question is not related to poker, respond with: 'I can only answer poker-related questions.'";

    const requestBody = {
        contents: [
            {
                parts: [{ text: `${systemInstruction}\n\n${userMessage}` }],
            },
        ],
    };

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorDetails = await response.json();
        console.error("API Error:", errorDetails.error.message);
        throw new Error(errorDetails.error.message || "An error occurred while fetching the response.");
    }

    const responseData = await response.json();
    return (
        responseData.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm not sure how to answer that."
    );
};
