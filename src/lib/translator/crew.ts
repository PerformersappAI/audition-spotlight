import { crewCall, type CrewIdentity } from "@/lib/breakdown/adapter";
import type { ProductionMessage } from "./types";

export interface CrewMessagesResult {
  messages: ProductionMessage[];
  languages: string[];
  preferred_language: string | null;
}

/** Crew-side message API — everything goes through the breakdown-crew function. */
export const crewMessageApi = (token: string, identity: CrewIdentity) => {
  const auth = { crew_id: identity.crew_id, crew_secret: identity.crew_secret };

  return {
    async list(before?: string): Promise<CrewMessagesResult> {
      const res = await crewCall<CrewMessagesResult>(token, "messages_list", {
        ...auth,
        ...(before ? { before } : {}),
      });
      return {
        messages: (res.messages || []) as ProductionMessage[],
        languages: res.languages || [],
        preferred_language: res.preferred_language ?? null,
      };
    },

    async post(subject: string, text: string): Promise<{ message: ProductionMessage; translated: boolean }> {
      return crewCall<{ message: ProductionMessage; translated: boolean }>(token, "message_post", {
        ...auth,
        subject: subject || undefined,
        text,
      });
    },

    async setLanguage(code: string | null): Promise<void> {
      await crewCall(token, "update_profile", { ...auth, preferred_language: code });
    },
  };
};

export type CrewMessageApi = ReturnType<typeof crewMessageApi>;
