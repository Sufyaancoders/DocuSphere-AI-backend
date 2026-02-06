const axios = require('axios');

const geminiResponse = async (command,assistantName,userName)=>{
    try {
        const apiUrl = process.env.GEMINI_API_URL + `?key=${process.env.GEMINI_API_KEY}`;
        const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.

        You are not Google. You will now behave like a voice-enabled assistant.

        Your task is to understand the user's natural language input and respond with a JSON object like this:

        {
        "type": "general" | "google_search" | "youtube_search" | "youtube_play" | "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" | "instagram_open" | "facebook_open" | "weather_show",
        "userInput": "<original user input>" // {only remove your name from userinput if it exists} and if someone wants to search something on Google or YouTube, userinput must only contain the query part.
        "response": "<a short spoken response to read out loud to the user>"
        }

        Instructions:
        - "type": Determine the intent of the user.
        - "userinput": Original sentence the user spoke.
        - "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.

        Type meanings:
        - "general": If it's a factual or informational question. agar koi aisa question puchta hai jiska ans tumhe pta hai usko bhi general ki category me rakho bs short answer dena.
        - "google_search": If user wants to search something on Google.
        - "youtube_search": If user wants to search something on YouTube.
        - "youtube_play": If user wants to directly play a video or song.
        - "calculator_open": If user wants to open a calculator.
        - "instagram_open": If user wants to open Instagram.
        - "facebook_open": If user wants to open Facebook.
        - "weather_show": If user wants to know the weather.
        - "get_time": If user asks for the current time.
        - "get_date": If user asks for today's date.
        - "get_day": If user asks what day it is.
        - "get_month": If user asks for the current month.

        Important:
        - Use ${userName} if someone asks "Who created you?"
        - Only respond with the JSON object, nothing else.

        Now your userInput - ${command}`;

        const result = await axios.post(apiUrl,{
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        })
        if (!result || !result.data) {
            console.error('Gemini API axios result is undefined or missing data:', result);
            return undefined;
        }
        if (!result.data.candidates || !result.data.candidates[0] || !result.data.candidates[0].content || !result.data.candidates[0].content.parts || !result.data.candidates[0].content.parts[0] || !result.data.candidates[0].content.parts[0].text) {
            console.error('Gemini API response structure unexpected:', result.data);
            return undefined;
        }
        return result.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API axios error:', error);
        return undefined;
    }
}

module.exports = geminiResponse