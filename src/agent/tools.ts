import { ChatCompletionTool } from 'openai/resources/chat/completions';

export const agentTools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'qualify_lead',
      description: 'Records lead details when budget and project scope are provided.',
      parameters: {
        type: 'object',
        properties: {
          budget: { type: 'string', description: 'Estimated budget mentioned by lead' },
          projectScope: { type: 'string', description: 'Brief summary of what they want built' },
          leadScore: { type: 'string', enum: ['High', 'Medium', 'Low'] }
        },
        required: ['budget', 'projectScope', 'leadScore']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'check_available_slots',
      description: 'Checks available calendar slots for a discovery call.',
      parameters: {
        type: 'object',
        properties: {
          preferredDay: { type: 'string', description: 'e.g. Tomorrow, Monday, 2026-07-27' }
        },
        required: ['preferredDay']
      }
    }
  }
];

export const executeTool = async (name: string, args: any) => {
  console.log(`[TOOL EXECUTED] ${name} with args:`, args);

  if (name === 'qualify_lead') {
    return JSON.stringify({ status: 'success', message: `Lead saved with ${args.leadScore} priority.` });
  }

  if (name === 'check_available_slots') {
    return JSON.stringify({ availableSlots: ['11:00 AM IST', '3:30 PM IST', '5:00 PM IST'] });
  }

  throw new Error(`Unknown tool: ${name}`);
};