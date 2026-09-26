import { GoogleGenAI } from "@google/genai";
import { HttpError } from "../utils/errors.js";

let client: GoogleGenAI | null = null;

/** Lazily creates the client so the server still boots if chat support isn't configured yet. */
export const getGemini = (): GoogleGenAI => {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new HttpError(503, "Chat support isn't set up yet");
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

// "gemini-flash-lite-latest" is a self-updating alias (Google moves it to the newest
// Flash-Lite release for you) and has by far the most generous free daily quota of
// Google's current models - a good fit for a support FAQ bot. Swap to
// "gemini-flash-latest" via CHAT_MODEL for smarter but lower-quota answers.
export const CHAT_MODEL = process.env.CHAT_MODEL || "gemini-flash-lite-latest";
