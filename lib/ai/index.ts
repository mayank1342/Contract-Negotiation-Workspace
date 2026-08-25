import { AIProvider } from './AIProvider';
import { DemoAIProvider } from './DemoAIProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { GeminiProvider } from './GeminiProvider';

export function getAIProvider(overrideMode?: 'demo' | 'openai' | 'gemini'): AIProvider {
  if (overrideMode === 'demo') {
    return new DemoAIProvider();
  }
  if (overrideMode === 'openai' && process.env.OPENAI_API_KEY) {
    return new OpenAIProvider();
  }
  if (overrideMode === 'gemini' && process.env.GEMINI_API_KEY) {
    return new GeminiProvider();
  }

  if (process.env.OPENAI_API_KEY) {
    return new OpenAIProvider();
  }
  if (process.env.GEMINI_API_KEY) {
    return new GeminiProvider();
  }

  return new DemoAIProvider();
}

export * from './types';
export * from './AIProvider';
