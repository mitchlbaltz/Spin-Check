import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Support runtime CJS / ESM environments safely
const currentDirname = typeof __dirname !== "undefined" ? __dirname : process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Configure body parsing with a limit for large image payloads
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // Initialize the Gemini API client safely
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in your Secrets settings.");
      }
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return ai;
  }

  // API endpoint for analyzing political communication
  app.post("/api/analyze", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: "No image payload provided." });
      }

      // Parse the base64 image data URL
      let mimeType = "image/jpeg";
      let base64Data = image;

      if (image.startsWith("data:")) {
        const matches = image.match(/^data:([a-zA-Z0-9-.+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          base64Data = matches[2];
        } else {
          return res.status(400).json({ error: "Invalid data URL format." });
        }
      }

      const client = getGeminiClient();

      const imagePart = {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      };

      const systemInstruction = `You are a strictly neutral, nonpartisan political communication analyst for the 'Spin Check' application.
Your goal is to perform objective, balanced rhetorical and structural analysis on political communication (such as yard signs, campaign mailers, news headlines, social media posts, bumper stickers, flyers, or op-eds) without showing any bias or taking a side.
You must never tell the user what to believe or who to vote for.
You must apply equal, rigorous scrutiny regardless of the political side or ideology represented.
Always phrase your checks and context neutrally, using objective language.
Provide your response in the specified JSON schema format.`;

      const prompt = `Analyze this image of political communication.
Identify the core elements, claims, and persuasion techniques. Be extremely precise, citing exact text or visual elements from the image.
If a technique (emotional appeal, framing, loaded language, us-vs-them, fear) is not present, mark 'present' as false, and provide an empty string for example and explanation.
If no logical fallacies are detected, return an empty array for 'logicalFallacies'.`;

      const analysisSchema = {
        type: Type.OBJECT,
        properties: {
          whatThisIs: {
            type: Type.STRING,
            description: "Exactly one sentence: what the message is and who it appears to be from."
          },
          mainClaims: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Key factual or opinion-based claims made in the communication."
          },
          persuasionTechniques: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                techniqueName: {
                  type: Type.STRING,
                  description: "Name of the technique (e.g., 'Emotional appeal', 'Framing', 'Loaded language', 'Us-vs-them', or 'Fear')."
                },
                present: {
                  type: Type.BOOLEAN,
                  description: "Whether this persuasion technique is present in the analyzed material."
                },
                example: {
                  type: Type.STRING,
                  description: "A short, direct example or quote pulled from the image demonstrating this technique."
                },
                explanation: {
                  type: Type.STRING,
                  description: "A brief, neutral explanation of how the technique is used."
                }
              },
              required: ["techniqueName", "present", "example", "explanation"]
            },
            description: "Analysis of common persuasion techniques: emotional appeals, framing, loaded language, us-vs-them, and fear."
          },
          logicalFallacies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  description: "The name of the logical fallacy (e.g., 'Strawman', 'Ad Hominem', 'False Dilemma')."
                },
                explanation: {
                  type: Type.STRING,
                  description: "A short, neutral explanation of why this fallacy is present."
                }
              },
              required: ["name", "explanation"]
            },
            description: "Logical fallacies present in the communication (return empty list if none detected)."
          },
          whatToCheck: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific factual claims a reader should verify, phrased neutrally."
          },
          missingContext: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "What key information or context is left out that would change or balance how a reader understands it."
          }
        },
        required: ["whatThisIs", "mainClaims", "persuasionTechniques", "logicalFallacies", "whatToCheck", "missingContext"]
      };

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [imagePart, { text: prompt }],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: analysisSchema,
          temperature: 0.1,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini.");
      }

      const parsedAnalysis = JSON.parse(responseText.trim());
      res.json(parsedAnalysis);
    } catch (error: any) {
      console.error("Analysis endpoint error:", error);
      res.status(500).json({ error: error?.message || "An unexpected error occurred during analysis." });
    }
  });

  // Serve static assets in production; run Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
