// Public configuration for a fictional-data-only, 24-hour group test.
// Never paste the private pilot code or Cloudflare SECRET key into this file.
// Keep submission false until the new Lambda, IAM and cutoff are configured.
window.ASSESSMENT_API_URL = "https://tb51edsrbj.execute-api.ap-southeast-2.amazonaws.com/assessment";
window.ASSESSMENT_ENABLE_SUBMISSION = true;// Change to true ONLY after the backend guard is configured and dry-tested.

// Must match PILOT_EXPIRES_AT in Lambda. After this time, UI falls back to preview.
// Example: "2026-11-14T18:30:00+05:30"; leave empty until configured.
window.ASSESSMENT_PILOT_EXPIRES_AT = "2026-11-14T20:00:00+05:30";

// Paste ONLY the public Cloudflare SITE key here (never the Secret Key).
window.ASSESSMENT_TURNSTILE_SITE_KEY = "0x4AAAAAAF_O7Loil9V203xU";
