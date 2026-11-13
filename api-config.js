// Public pilot configuration. This endpoint URL is not a credential.
// TEST MODE: no learner details are transmitted. Never change the safety flag
// to true on a public site without approved deployment, privacy/consent,
// effective server-side bot validation, and independent abuse controls.
window.ASSESSMENT_API_URL = "https://tb51edsrbj.execute-api.ap-southeast-2.amazonaws.com/assessment";
window.ASSESSMENT_ENABLE_SUBMISSION = true; // Change to true ONLY after the backend guard is configured and dry-tested.

// Paste ONLY the public Cloudflare SITE key here (never the Secret Key).
window.ASSESSMENT_TURNSTILE_SITE_KEY = "0x4AAAAAAF_O7Loil9V203xU";
