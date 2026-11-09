/** Deployment settings. Override with VITE_API_URL / VITE_BOT_USERNAME in `.env`. */
export const config = {
  apiUrl:
    import.meta.env.VITE_API_URL ?? "https://mkjjqvywkwzwdscihibm.supabase.co/functions/v1/api",
  botUsername: import.meta.env.VITE_BOT_USERNAME ?? "SipsikLoveBot",
} as const;
