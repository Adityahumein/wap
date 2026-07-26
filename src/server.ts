import express from 'express';
import dotenv from 'dotenv';
import { runAgentHarness } from './agent/harness';
import { sendWhatsAppMessage } from './integration/whatsapp';

dotenv.config();

const app = express();
app.use(express.json());

// Meta Webhook Verification (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    console.log('[WEBHOOK VERIFIED]');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});


app.post('/webhook', async (req, res) => {
  // Acknowledge by meta immediately
  res.status(200).send('EVENT_RECEIVED');

  try {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0]?.value;
    const message = changes?.messages?.[0];

    if (message && message.type === 'text') {
      const fromNumber = message.from;
      const textBody = message.text.body;

      console.log(`\n=============================`);
      console.log(`📥 [INCOMING] From ${fromNumber}: "${textBody}"`);

      
      console.log(`🧠 [AGENT] Thinking...`);
      const reply = await runAgentHarness(fromNumber, textBody);
      console.log(`✅ [AGENT] Reply Generated: "${reply.substring(0, 50)}..."`);

      
      console.log(`🚀 [SENDING] Pushing message back to WhatsApp...`);
      await sendWhatsAppMessage(fromNumber, reply);
      console.log(`🎉 [SUCCESS] Message delivered!`);
      console.log(`=============================\n`);
    }
  } catch (error: any) {
    console.error(`\n🚨 [FATAL ERROR]:`);
    // error debugin ke liye
    console.error(error.response?.data || error.message);
    console.log(`==================\n`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Agent Harness running on port ${PORT}`));