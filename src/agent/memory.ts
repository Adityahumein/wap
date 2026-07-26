import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const sessions = new Map<string, ChatCompletionMessageParam[]>();

export const getSessionHistory = (phone: string): ChatCompletionMessageParam[] => {
  if (!sessions.has(phone)) {
    sessions.set(phone, []);
  }
  return sessions.get(phone)!;
};

export const appendToSession = (phone: string, message: ChatCompletionMessageParam) => {
  const history = getSessionHistory(phone);
  history.push(message);
  if (history.length > 10) {
    sessions.set(phone, history.slice(-10));
  }
};