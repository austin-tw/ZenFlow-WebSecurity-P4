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
2. Create a new directory for your project:
   ` mkdir google-sso-example`
   `cd google-sso-example`
3. Run the following command to create a package.json file: npm init -y
4. Run the following command to install the required packages:
   `npm install express argon2 mongoose body-parser dotenv JSON web token express-session passport passport-google-oauth20 helmet connect-mongo csurf ejs https fs hsts express-validator`
5. Download the files from the repository and paste into your project folder
6. Create a .env file including:

```
   JWT_SECRET=(make up your own secret key)
   GOOGLE_CLIENT_ID=(from part A, step d)
   GOOGLE_CLIENT_SECRET=(from part A, step d)
   SESSION_SECRET=(make up your own secret key)
   ENCRYPTION_KEY=(make up a 32-bit key, example: MySuperSecureEncryptionKey123456)
   DB_CONNECTION=mongodb://127.0.0.1:27017/secure-session
   PORT=3000
```

# Input Validation Implementation

I used express-validator to limit the input of:
Name: 3–50 alphabetic characters
Email: Follows a standard email format
Bio: Max 500 characters, no HTML tags and no special characters

Sanitization is achieved via the following methods (found in \app.js):

```
const { body, validationResult } = require("express-validator");

app.post(
"/update-profile",
ensureSuperUser,
[
body("screenName")
.trim()
.escape()
.matches(/^[A-Za-z0-9]{3,50}$/)
.withMessage(
"Screen name must be 3-50 characters and can only contain letters and numbers"
),

    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email format"),

    body("bio")
      .optional()
      .trim()
      .escape()
      .isLength({ max: 500 })
      .withMessage("Bio must not exceed 500 characters"),

],
```

This ensures injected malicious codes would not be executed.

# Output Encoding Implementation

I used EJS as the templating engine, which automatically escapes content by default when using the <%= %> tags. To ensure injected malicious codes would not be executed.

Example (found in \super-dashboard.ejs):

```<h1>Welcome <%= username %>!</h1>
    <h3 class="red">
        Role:<%= role %>
    </h3>
    <p>Screen Name: <%= screenName %>
    </p>
    <p>Email: <%= email %>
    </p>
    <p>Bio: <%= bio %>
    </p>
    <a href="/logout">Logout</a>
```

# Encryption of Sensitive Data

Sensitive data (user's email address and bio) are encrypted before storing in the database with Node's built-in crypto module by:

-creating \utils\encryption.js that handles encrypt and decrypt using AES-256-CBC

-\app.js routes are updated accordingly with encrypt and decrypt methods, for example:

```
// Superuser-only route
app.get("/super-dashboard", ensureSuperUser, (req, res) => {
  // Decrypt sensitive data before sending to template
  const decryptedEmail = req.user.email ? decrypt(req.user.email) : "";
  const decryptedBio = req.user.bio ? decrypt(req.user.bio) : "";
```

# Third-Party Dependency Management

Automated updates and regular security audits were implemented by Creating \.github\workflows\security-check.yml for GitHub Actions:

```
name: Security Check

on:
  schedule:
    - cron: "0 0 * * 0" # Run weekly on Sunday at midnight

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Run security audit
        run: npm audit
```

which runs once a week and check your dependencies with npm audit for security issues and reports any vulnerabilities if found. The results will show in your GitHub repository's "Actions" tab, if any vulnerabilities are found, it will show in the workflow logs.

Also added local command at package.json:
`"security": "npm audit"`
Which allows security checks to run locally by using:
`npm run security`

# Lessons Learned

There were several challenges I faced during this project:

For Input Validation Implementation, before this course, I only knew how to use HTML or JavaScript to validate input. Using express-validator was new to me, so I had to read the documentation to figure out which methods to use and how to apply them to get the results I wanted.

For Output Encoding Implementation, this part was a bit easier because I built the web app using EJS, which escapes content by default when using <%= %> tags. This meant that any injected malicious code wouldn’t execute.

For Encryption of Sensitive Data, I had to search online to understand how to set it up. At first, I couldn’t get the encryption to work — my web app kept throwing error messages. After a lot of debugging, I realized the problem was that I didn’t specify the AES type correctly, and my encryption key was missing 1 byte (it should have been 32 bytes, but mine was only 31 bytes).

For Third-Party Dependency Management, it was tough because GitHub Actions was new to me. I had to search the internet to learn how to set it up. The examples I found had a ton of features and settings, so I had to go through them carefully to figure out which ones were actually useful for my web app.

After finishing this phase of the project, my security toolbox has expanded. I realized that there are a lot of powerful web security tools, but they aren’t always easy to set up. There are so many parameters to configure, and making everything work together can be frustrating. More than once, I had my web app working fine, but then adding a new security feature caused conflicts with the existing code, breaking the app. Alas, more often than not, the best way to solve these conflicts was to read the documentation carefully and have a lot of patience for trial and error.
