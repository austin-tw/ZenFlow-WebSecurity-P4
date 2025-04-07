# Setting Up the Repository

## Part A: Set Up Google OAuth Credentials

1. Log in to your Google Cloud Platform (GCP) account and go to the Google Cloud Console.
2. Click the Project drop-down (top-left) and select New Project.
3. Name your project and click Create.
4. Enable the Google+ API for your project.
5. In the left sidebar, select OAuth consent screen.
   a. Choose the User Type(External for most applications) and click Create.
   b. Complete the required fields (app name, support email) and click Save.
6. Go to Credentials > Create Credentials > OAuth Client ID.
   a. Select Web application as the Application type.
   b. Set the Authorized redirect URIs to http://localhost:3000/auth/google/callback
   c. Click Create.
   d. Write down the Client ID and Client Secret You’ll need these later.

## Part B: Setting Up MongoDB with Compass

1. If MongoDB is not already installed, download and install it from the MongoDB Download Centre(https://www.mongodb.com/try/download/community).
2. Launch MongoDB Compass.
3. Click New Connection and enter your MongoDB connection string (or use the default mongodb://localhost:27017 if you’re running MongoDB locally).
4. Click Connect to access the MongoDB instance.
5. Click Create Database in the left sidebar.
6. Name the database google-sso and create an initial collection called users.
   Note: You can add more collections later as needed.
7. Click Create Database.
8. In the sidebar, select google-sso to open the database.
9. If you haven’t already created the users collection, click Add Collection, name it users, and click Create Collection. This collection stores user data, including login count and role (e.g., user or super user).

## Part C: Create a New Node.js Project

1. Open a terminal or command prompt.
2. Create a new directory for your project
3. Run the following command to install the required packages:
   `npm install express argon2 mongoose body-parser dotenv JSON web token express-session passport passport-google-oauth20 helmet connect-mongo csurf ejs https fs hsts express-validator`
4. Download the files from the repository and paste into your project folder
5. Create a .env file including:

```
   JWT_SECRET=(make up your own secret key)
   GOOGLE_CLIENT_ID=(from part A, step d)
   GOOGLE_CLIENT_SECRET=(from part A, step d)
   SESSION_SECRET=(make up your own secret key)
   ENCRYPTION_KEY=(make up a 32-bit key, example: MySuperSecureEncryptionKey123456)
   DB_CONNECTION=mongodb://127.0.0.1:27017/secure-session
   PORT=3000
```

# Ethical Responsibilities of Security Professionals

My testing and mitigation efforts align with ethical guidelines in web security, because I only perform testing attacks such as SQL injection, XSS attacks, and automated OWASP Zap attacks on my own website in a local controlled environment. I did not try to attack someone else's website without their permission. I am also aware that performing test attacks on someone else's website without their permission, even if you did not cause any change or damages, is still considered a violation of ethical guidelines.

# Legal Implications of Security Testing

My web app falls under the legal framework of Canada's Personal Information Protection and Electronic Documents Act (PIPEDA), under which my fictional company is accountable for safeguarding users' personal information. My company must also obtain users' consent to collect such information and make sure it is not used beyond the purposes stated when the information was collected.

# Security Testing

I used manual testing, OWASP ZAP, and npm audit to check for vulnerabilities.

## Manual Testings:

-SQL injection attack. Tried injecting --, ' OR '1'='1, and " in the form field. All attempts were correctly rejected by pattern limits or properly escaped to prevent malicious code from running.

-XSS attack. Tried injecting <script>alert("XSS")</script> in form fields. All attempts were correctly rejected by pattern limits or properly escaped to prevent malicious code from running.

## OWASP Zap:

Steps:

1. Started ZAP and selected [Automated Scan]
2. Entered the URL to attack and clicked [Attack]
3. Waited for the scan to finish, then checked the report for vulnerabilities

After running ZAP’s automated test, one vulnerability was found:
Alert: Cookie without SameSite Attribute
Alert reference: 10054-1

Description: A cookie was set without the SameSite attribute, which means it could be sent with cross-site requests. The SameSite attribute helps defend against cross-site request forgery, cross-site script inclusion, and timing attacks.

Solution: Make sure the SameSite attribute is set to either lax or ideally strict for all cookies.

## npm audit:

Steps:

1. In Git Bash, navigated to the project folder and ran `npm audit`
2. Read through the audit report

After running npm audit, a vulnerability was found:
Package: cookie <0.7.0
Issue: The cookie package accepts cookie name, path, and domain with out-of-bounds characters
Advisory: https://github.com/advisories/GHSA-pxg6-pf52-xh8x

# Vulnerability Fixes

## Alert: Cookie without SameSite Attribute

To fix the vulnerability, I added `sameSite: "lax"` to the cookie settings in app.js.
Ideally, it should be set to "strict", but that breaks Google OAuth since it needs to redirect to the OAuth server and back—"strict" won’t send the cookie during that cross-site redirect.

## cookie accepts cookie name, path, and domain with out of bounds characters

To fix the vulnerability, I ran `npm audit fix` then `npm audit fix --force` to get the updated version of the dependency.

# Testing Tools

I used these tools for the security testing process:

OWASP ZAP – An automated tool that performs various testing attacks to check for different vulnerabilities.

npm audit – An automated tool built into Node Package Manager. It scans project dependencies for outdated packages and known security vulnerabilities.

# Lessons Learned

## What worked well:

-Learned to understand different aspects of a threat model, like identifying critical assets and how attackers could potentially exploit the web app.

-Creating the threat model diagram helped give a holistic view of how each type of attack and security measure affects different parts of the app, and how they all interact.

-Categorizing threats using the STRIDE framework made it easier to understand the different types of threats and their risks.

-Using OWASP ZAP to automate security testing saved a lot of time compared to doing everything manually.

-Was able to perform manual tests like SQL injection and XSS to target specific areas of the web app.

-ZAP provided detailed descriptions for any vulnerabilities found, which made fixing them a lot easier and took out a lot of the guesswork.

## Challenges Faced:

-Creating the threat model diagram took quite a bit of thinking, since many threats and security measures affect more than one part of the web app. Figuring out how to simplify those complex connections into a clear, easy-to-understand diagram was challenging.

-Getting ZAP to install on Windows was a bit of a hassle. At first, Chrome flagged the download as risky and refused to complete it. I had to switch to Edge to get the file. Then during installation, it said it couldn’t find the Java Runtime Environment on my PC—even though I had already installed Java. Eventually, I got it working by installing Eclipse Temurin JDK.

-Trying to fix vulnerabilities based on ZAP’s report was also challenging. The alerts came with good descriptions, but the documentation wasn’t the easiest to follow. There were a lot of technical terms and concepts that took time to understand.

## Areas for Improvement

-There are various settings in ZAP, and in the future, I would tweak them to test more aspects of the web app.

-In the future, I would consider running other automated security testing tools, such as Burp Suite and Nmap, on the web app to check for vulnerabilities that might be missed by ZAP.
