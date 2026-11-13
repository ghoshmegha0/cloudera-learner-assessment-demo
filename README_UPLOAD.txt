GITHUB PAGES v1.9 — SAFE DEPLOYMENT

Before uploading:
1. Extract github_pages_v1_9.zip to a local folder.
2. Open api-config.js; replace PASTE_PUBLIC_SITE_KEY_HERE with your existing
   PUBLIC Turnstile Site Key (NEVER the Cloudflare Secret Key).
3. Keep ASSESSMENT_ENABLE_SUBMISSION=false until the AWS one-email guard is
   configured and tested. This leaves the site preview-only.
4. Upload index.html, src.js, styles.css, api-config.js, robots.txt and the
   data/questions.json file to GitHub, keeping questions.json under data/.
5. Never upload PILOT_ACCESS_CODE, TURNSTILE_SECRET_KEY, or backend code.

Only once DynamoDB and IAM and the private 64-char code are configured in
Lambda, enable ENABLE_TEST_EMAIL=true, and then set the frontend
ASSESSMENT_ENABLE_SUBMISSION=true for ONE fictional end-to-end test.
The private code is typed on the review page, never saved to GitHub.
The backend rejects any learner email not under example.com/example.org/
example.net, and reserves only ONE send per PILOT_RUN_ID via DynamoDB.
Disable both submission flags after the test.
