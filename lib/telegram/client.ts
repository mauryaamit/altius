import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

/**
 * Validates and retrieves server-side Telegram MTProto credentials.
 * Throws a descriptive error if required environment variables are missing.
 */
export function getTelegramCredentials(): {
  apiId: number;
  apiHash: string;
  sessionStr: string;
} {
  const apiIdStr = process.env.TELEGRAM_API_ID;
  const apiHash = process.env.TELEGRAM_API_HASH;
  const sessionStr = process.env.TELEGRAM_SESSION || "";

  if (!apiIdStr || !apiHash) {
    throw new Error(
      "[Telegram] TELEGRAM_API_ID and TELEGRAM_API_HASH environment variables must be configured."
    );
  }

  const apiId = parseInt(apiIdStr.trim(), 10);
  if (isNaN(apiId)) {
    throw new Error("[Telegram] TELEGRAM_API_ID must be a valid integer.");
  }

  return {
    apiId,
    apiHash: apiHash.trim(),
    sessionStr: sessionStr.trim(),
  };
}

/**
 * Instantiates a GramJS TelegramClient for user-account MTProto connection.
 * Zero credentials or sessions are logged.
 */
export function createTelegramClient(sessionOverride?: string): {
  client: TelegramClient;
  session: StringSession;
} {
  const { apiId, apiHash, sessionStr } = getTelegramCredentials();
  const session = new StringSession(
    sessionOverride !== undefined ? sessionOverride : sessionStr
  );
  const client = new TelegramClient(session, apiId, apiHash, {
    connectionRetries: 5,
  });
  return { client, session };
}
