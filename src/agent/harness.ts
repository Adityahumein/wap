import 'dotenv/config'; // <-- This fixes your Missing Credentials error!
import OpenAI from 'openai';
import { getSessionHistory, appendToSession } from './memory';
import { agentTools, executeTool } from './tools';

// Point the OpenAI client to Google's Gemini server cause gemini free tha mere pass
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/'
});

const SYSTEM_PROMPT = `
You are Pyrock AI's WhatsApp Automation Assistant.
Your goal is to qualify inbound leads for software/agent development services.

Rules:
1. Be concise, polite, and direct (conversational for WhatsApp).
2. Ask about their project scope and budget.
3. Once they share budget and scope, call the "qualify_lead" tool.
4. If they ask to book a call, use "check_available_slots".
`;

export const runAgentHarness = async (phone: string, userMessage: string): Promise<string> => {
  const history = getSessionHistory(phone);

  const newPromptMessage = { role: 'user' as const, content: userMessage };
  appendToSession(phone, newPromptMessage);

  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...history
  ];

  // Using Gemini's fastest model via the OpenAI SDK wrapper
  let response = await openai.chat.completions.create({
    model: 'gemini-3.1-flash-lite', 
    messages,
    tools: agentTools,
    tool_choice: 'auto'
  });

  let responseMessage = response.choices[0].message;

  while (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
    appendToSession(phone, responseMessage);

    for (const toolCall of responseMessage.tool_calls) {
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments);

      const toolResult = await executeTool(toolName, toolArgs);

      appendToSession(phone, {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: toolResult
      });
    }

    response = await openai.chat.completions.create({
      model: 'gemini-2.5-flash',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...getSessionHistory(phone)
      ]
    });

    responseMessage = response.choices[0].message;
  }

  const finalReply = responseMessage.content || "I'm here to help!";
  appendToSession(phone, { role: 'assistant', content: finalReply });

  return finalReply;
};