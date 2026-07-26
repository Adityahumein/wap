# Autonomous WhatsApp AI Agent 

This project is a Node.js/TypeScript application that connects a custom AI Agent (powered by Large Language Models) directly to WhatsApp using the official Meta WhatsApp Cloud API. It features autonomous conversational capabilities and LLM tool-calling (e.g., lead qualification based on budget).

##  Features
* **Real-time Webhook Integration:** Catches incoming WhatsApp messages instantly.
* **Autonomous Agent Harness:** Routes incoming text to an AI model for processing and tool execution.
* **Meta Graph API Outbound:** Sends generated responses back to the user's physical device.
* **Tool Calling:** Capable of triggering backend functions (like `qualify_lead`) based on conversation context.

##  Setup & Installation

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd <your-repo-folder>
npm install

2. Environment Variables
Create a .env file in the root directory and add your credentials:
WHATSAPP_ACCESS_TOKEN="your_meta_temporary_access_token"
WHATSAPP_PHONE_NUMBER_ID="your_meta_phone_number_id"
VERIFY_TOKEN="pyrock_secret_123"
PORT=3000
OPENAI_API_KEY="qwertyuiopdfghjmk,cvbnm"
3. Start the Server & Ngrok
You need two terminal windows running simultaneously.
Terminal 1 (Start the local server):
npm run dev
# or: npx tsx watch src/server.ts
Terminal 2 (Start Ngrok to expose your local port):
ngrok http 3000
Meta Dashboard Configuration
Go to the Meta Developer Dashboard.

Create an App (Type: Business) and add the WhatsApp product.

Navigate to WhatsApp > API Setup to get your Temporary Access Token and Phone Number ID.

Under To, whitelist your personal phone number and verify it.

Go to the Webhooks section (or WhatsApp > Configuration).

Set the Callback URL to your Ngrok forwarding address (e.g., https://<your-ngrok-id>.ngrok.app/webhook).

Enter your VERIFY_TOKEN and save.

Subscribe to the messages webhook event.

Crucial Fix: The "Shadow Delivery" Bug
If Meta's dashboard successfully verifies your webhook but fails to deliver incoming messages to your terminal, you must manually link your App to your WhatsApp Business Account (WABA).

Copy your WhatsApp Business Account ID from the API Setup page.

Go to Tools > Graph API Explorer in the Meta top menu.

Change the HTTP method to POST.

In the URL bar, enter: <YOUR_WABA_ID>/subscribed_apps

Click Submit. You should see {"success": true}. Your webhook will now receive all incoming messages!

Testing
Send a message from your whitelisted physical phone to your Meta Test Number. You will see the incoming payload in your terminal, the agent will process the text, and the AI's reply will arrive on your phone.