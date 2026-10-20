NAVODAYA FOREVER SURVEY
========================

Files:
- index.html       public survey
- admin.html       basic response viewer (DO NOT publish publicly without admin authentication)
- app.js
- questions.js
- style.css
- firestore.rules

SETUP (₹0):
1. Create/use a Firebase project.
2. Enable Firestore Database.
3. Copy the Firebase Web App config into app.js and admin.html.
4. Deploy the Firestore rules.
5. Host the folder using any free static host.

IMPORTANT:
- The current admin page is intentionally a starter dashboard. Before real sharing, protect it with Firebase Authentication + admin custom claim/rules.
- Public survey submission is enabled, so a person can submit multiple responses. For a 25-person private survey, you can later add Google login or a one-time invite code.
- Do not collect phone numbers or sensitive personal information in this survey unless necessary.

NEXT BUILD:
After collecting ~25 responses, use the data to decide the V2 Navodaya Forever requirements before coding the main app.
