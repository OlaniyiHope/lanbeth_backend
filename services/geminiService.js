import axios from "axios";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_IMAGE_MODEL =
  process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash";
const GEMINI_API_VERSION = process.env.GEMINI_API_VERSION || "v1beta";

function getGeminiUrl(modelName) {
  return `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/models/${modelName}:generateContent`;
}

function ensureApiKey() {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "Gemini API key is missing. Set GEMINI_API_KEY in your backend .env file."
    );
  }
}

function extractText(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .map((part) => part?.text || "")
    .join("")
    .trim();
}

function stripJsonFences(text) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function waitForRetry(attempt) {
  const delay = Math.min(1500 * 2 ** attempt, 45000);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function callGemini(
  prompt,
  {
    systemInstruction,
    temperature = 0.7,
    maxOutputTokens = 2048,
    responseMimeType = "text/plain",
  } = {}
) {
  ensureApiKey();
  const models = Array.from(
    new Set(
      [
        GEMINI_MODEL,
        "gemini-2.5-flash",
      ].filter(Boolean)
    )
  );

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens,
      responseMimeType,
    },
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  for (const modelName of models) {
    for (let attempt = 0; attempt < 8; attempt++) {
      try {
        const response = await axios.post(getGeminiUrl(modelName), payload, {
          params: {
            key: GEMINI_API_KEY,
          },
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 45000,
        });

        const text = extractText(response.data);
        if (!text) {
          throw new Error("Gemini returned an empty response.");
        }

        return text;
      } catch (error) {
        const status = error?.response?.status;
        if (
          error?.code === "ECONNABORTED" ||
          error?.code === "ENOTFOUND" ||
          error?.code === "ECONNRESET" ||
          status === 429 ||
          status >= 500
        ) {
          await waitForRetry(attempt);
          continue;
        }

        const apiMessage =
          error?.response?.data?.error?.message || error?.message || "Gemini API call failed";

        if ((status === 400 || status === 404) && models.indexOf(modelName) < models.length - 1) {
          break;
        }

        throw new Error(apiMessage);
      }
    }
  }

  throw new Error(
    `Gemini API retries exhausted for models: ${models.join(
      ", "
    )}. Check the key, model access, and network connectivity.`
  );
}

export async function callGeminiJson(prompt, options = {}) {
  const text = await callGemini(prompt, {
    ...options,
    responseMimeType: "application/json",
  });

  try {
    return JSON.parse(stripJsonFences(text));
  } catch {
    throw new Error("Gemini returned invalid JSON.");
  }
}

export async function callGeminiJsonWithImage(
  prompt,
  {
    mimeType = "image/jpeg",
    imageBuffer,
    systemInstruction,
    temperature = 0.1,
    maxOutputTokens = 2048,
  } = {}
) {
  ensureApiKey();

  if (!imageBuffer) {
    throw new Error("An image buffer is required for Gemini image parsing.");
  }

  const models = Array.from(
    new Set(
      [
        GEMINI_IMAGE_MODEL,
        "gemini-2.5-flash",
      ].filter(Boolean)
    )
  );

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: imageBuffer.toString("base64"),
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature,
      maxOutputTokens,
      responseMimeType: "application/json",
    },
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  for (const modelName of models) {
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        const response = await axios.post(getGeminiUrl(modelName), payload, {
          params: { key: GEMINI_API_KEY },
          headers: { "Content-Type": "application/json" },
          timeout: 60000,
        });

        return JSON.parse(stripJsonFences(extractText(response.data)));
      } catch (error) {
        const status = error?.response?.status;
        if (
          error?.code === "ECONNABORTED" ||
          error?.code === "ENOTFOUND" ||
          error?.code === "ECONNRESET" ||
          status === 429 ||
          status >= 500
        ) {
          await waitForRetry(attempt);
          continue;
        }

        const apiMessage =
          error?.response?.data?.error?.message || error?.message || "Gemini image OCR failed";

        if ((status === 400 || status === 404) && models.indexOf(modelName) < models.length - 1) {
          break;
        }

        throw new Error(apiMessage);
      }
    }
  }

  throw new Error(
    `Gemini image OCR retries exhausted for models: ${models.join(", ")}.`
  );
}
