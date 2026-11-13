CLOUDERA ASSESSMENT v1.7.1 — SAFE AWS API-CONNECTED PREVIEW

Changes
* AWS endpoint is configured in api-config.js.
* Public submission is explicitly DISABLED; all learner details remain local to the browser and the assessment ends as a preview.
* A "Check AWS connection" button sends ONLY {} to API Gateway. The expected HTTP 503 verifies API and Lambda connectivity while email is disabled.
* Never change window.ASSESSMENT_ENABLE_SUBMISSION to true on the public website without approved customer data hosting, bot protection with SERVER-SIDE token validation, consent/privacy review, and abuse safeguards.
* Keep AWS Lambda ENABLE_TEST_EMAIL=false.

GitHub upload steps
1. Open github.com/ghoshmegha0/cloudera-learner-assessment-demo
2. Add file > Upload files. Upload the contents of this folder (index.html, src.js, styles.css, api-config.js, robots.txt, and data/questions.json), not this README and not any Lambda files. Preserve data/questions.json as a nested path.
3. Commit directly to main. GitHub Pages will publish automatically if configured from main / (root).
4. Hard-refresh https://ghoshmegha0.github.io/cloudera-learner-assessment-demo/ (Cmd+Shift+R).
5. On step 1 click "Check AWS connection". It should say "Connected to AWS API Gateway and Lambda. Email sending remains disabled." without transmitting learner details.
6. Enter fictional data to try the rest of the questionnaire; "Finish preview" will not send anything.

NOT FOR ACTUAL CUSTOMER SUBMISSIONS. This is a personal-account technical proof of concept.
