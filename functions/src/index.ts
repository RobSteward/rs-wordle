import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

admin.initializeApp();

export const processWord = onDocumentCreated(
  "scores/{documentId}",
  async (event) => {
    const document = event.data;
    if (!document) {
      logger.error("No document found in event data");
      return;
    }

    const word = document.get("LAST_GAME_WORD");
    if (!word) {
      logger.error("No word found in document");
      return;
    }

    logger.info(`Word is: ${word}`);
    const response = await defineWord(word);
    logger.info(response);
    return response;
  }
);

export const processWordUpdate = onDocumentUpdated(
  "scores/{documentId}",
  async (event) => {
    const document = event.data;
    if (!document) {
      logger.error("No document found in event data");
      return;
    }

    const word = document.after.get("LAST_GAME_WORD");
    if (!word) {
      logger.error("No word found in document");
      return;
    }

    logger.info(`Word is: ${word}`);
    const response = await defineWord(word);
    logger.info(response);
    return response;
  }
);

/**
 * Defines the word.
 * @param {string} word - The word to define.
 * @return {Promise<{LAST_GAME_WORD_DEFINITION: string}>} Word definition.
 */
async function defineWord(
  word: string
): Promise<{ LAST_GAME_WORD_DEFINITION: string }> {
  return {LAST_GAME_WORD_DEFINITION: `Definition of ${word}`};
}
