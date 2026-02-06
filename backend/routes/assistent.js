const express = require("express");
const { askToAssistant } = require("../controller/gemini");
const isAuth = require("../middlewares/auth");
const { generateImageFromPrompt } = require("../aiimage");
const router = express.Router();

router.post('/ask-to-assistant', isAuth, askToAssistant);
router.post("/generate-image", isAuth, async (req, res) => {
    const { prompt } = req.body;
    try {
        const image = await generateImageFromPrompt(prompt);
        res.json({ image });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;