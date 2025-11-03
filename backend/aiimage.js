const OpenAI = require('openai');

const client = new OpenAI({
    baseURL: 'https://api.studio.nebius.com/v1/',
    apiKey: process.env.NEBIUS_API_KEY,
});

async function generateImageFromPrompt(prompt) {
    try {
        const response = await client.images.generate({
            model: "stability-ai/sdxl",
            response_format: "b64_json",
            response_extension: "png",
            width: 1024,
            height: 1024,
            num_inference_steps: 30,
            negative_prompt: "",
            seed: -1,
            loras: null,
            prompt: prompt
        });
        // Assuming response.data contains the base64 image
        return response.data[0].b64_json;
    } catch (error) {
        throw new Error('Image generation failed: ' + error.message);
    }
}

module.exports = { generateImageFromPrompt };