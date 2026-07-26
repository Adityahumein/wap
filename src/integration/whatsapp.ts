import axios from 'axios';

export const sendWhatsAppMessage = async (toPhone: string, text: string) => {
  const url = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  
  await axios.post(
    url,
    {
      messaging_product: 'whatsapp',
      to: toPhone,
      type: 'text',
      text: { body: text }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
};