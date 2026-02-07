
const User = require('../models/user');
const moment = require("moment");
const geminiResponse  = require('../gemini');
const askToAssistant = async(req,res)=>{
    try {
        const {command} = req.body
        if(!command){
            return res.status(400).json({error: "Missing command"});
        }
        const user =await User.findById(req.userId)
        if(!user){
            return res.status(400).json({error:"User not Found"});
        }
        user.history.push(command)
        user.save()
        const userName = user.name
        const assistantName =  "Docusphere ai"

        let result;
        try {
            result = await geminiResponse(command,assistantName,userName);
            console.log('Gemini API raw result:', result);
            if (result === undefined) {
                console.error('Gemini API returned undefined result');
            }
        } catch (err) {
            console.error('Error calling Gemini API:', err);
            return res.status(500).json({response: 'Error calling Gemini API'});
        }
           if (!result) {
            return res.json({
                type: "general",
                userInput: command,
                response: "Sorry, I couldn't get a response from the AI. Please try again."
            });
        }
        let gemResult;
        if(typeof result === "string"){
            let clean = result.trim();
            if (clean.startsWith("```")) {
                clean = clean.replace(/```[a-zA-Z]*\n?/, "").replace(/```$/, "");
            }
            try {
                gemResult = JSON.parse(clean);
            } catch (error) {
                const jsonMatch = clean.match(/{[\s\S]*}/)
                if(jsonMatch){
                    gemResult = JSON.parse(jsonMatch[0]);
                }else{
                    console.error('Failed to parse Gemini result:', clean);
                    // Fallback: return plain text if not JSON
                    return res.json({
                        type: "general",
                        userInput: command,
                        response: clean || result || "No response from Gemini API"
                    });
                }
            }
        }else {
            gemResult=result;
        }
        
        const type = gemResult.type;

        // If type is missing, fallback to generic response
        if (!type) {
            let fallbackResponse = "No response from Gemini API";
            if (typeof gemResult === "string" && gemResult.trim() !== "") {
                fallbackResponse = gemResult;
            } else if (gemResult && typeof gemResult === "object") {
                fallbackResponse = JSON.stringify(gemResult);
            }
            return res.json({
                type: "general",
                userInput: command,
                response: fallbackResponse
            });
        }

        switch (type) {
            case 'get_date':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current date is ${moment().format("YYYY-MM-DD")}`
                });
            case 'get_time':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current time is ${moment().format("hh:mm A")}`
                });
            case 'get_day':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current day is ${moment().format("dddd")}`
                });
            case 'get_month':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current month is ${moment().format("MMMM")}`
                });
            case 'google_search':
            case 'youtube_search':
            case 'youtube_play':
            case 'calculator_open':
            case 'instagram_open':
            case 'facebook_open':
            case 'weather_show':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: gemResult.response,
                });
            case 'general':
            default:
                return res.json(gemResult);
        }

    } catch (error) {
        console.log(error);
        // Always return 200 with fallback message on any error
        return res.json({
            type: "general",
            userInput: req.body.command || "",
            response: "Sorry, I couldn't process your request."
        });
    }
}

module.exports = {
    askToAssistant
};