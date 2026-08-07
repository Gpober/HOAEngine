// One place to name and tune the assistant. Rename here and it changes
// everywhere — persona, prompt, and UI all read from this. Same seam as the
// Tulips and PDS Logix platforms, so the three assistants stay siblings.
export const ASSISTANT_NAME = "Zordon";
export const ASSISTANT_MODEL = "claude-opus-4-8";

// Ceiling, not a target — the model stops when it's done.
export const ASSISTANT_MAX_TOKENS = 8192;
