CLOUDERA LEARNER ASSESSMENT — STATIC REVIEW DEMO

This package is for demonstration/review with fictional learner data ONLY.
It does NOT send email, store information, or collect assessment submissions.
The existing internal SMTP backend is not part of this ZIP.

WARNING: GitHub Pages and Cloudflare Pages URLs may be publicly reachable.
Do not deploy draft Cloudera learning content on an unapproved public
repository/site. Use only a company-authorized hosting account and content.
Noindex and robots.txt are NOT access controls.

To test locally, open a terminal IN this folder and run:
  python3 -m http.server 8090
Then visit http://127.0.0.1:8090 and use fictional test details.

To make a shareable link (only if authorized for this Cloudera content):
1. On an approved GitHub account, create a repository.
2. Add contents of this directory to the repository root.
3. Settings > Pages > Deploy from a branch > main > /(root) > Save.
4. Open the URL supplied by GitHub Pages.

For a REAL customer link, deploy a secure backend separately and use an
approved mail API/SMTP service reachable from the hosting environment.
Never publish the current localhost server directly to the Internet.
