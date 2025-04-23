import OpenAI from 'openai';

// Define ChatMessage interface
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Define sentiment analysis response interface
export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral' | 'anxious' | 'depressed' | 'stressed';
  score: number;
  followUpQuestion: string;
  relaxationSuggestions: string[];
  recommendTherapy: boolean;
}

class OpenAIService {
  private openai: OpenAI;
  private apiKey: string;

  constructor() {
    // In a real app, you'd want to get this from environment variables or secure storage
    // For demo purposes, we're hardcoding it (not recommended for production)
    this.apiKey = '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'; // Replace with your actual API key
    this.openai = new OpenAI({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true // Only use this for demos/prototypes
    });
  }

  /**
   * Sends a message to OpenAI and returns the response
   * @param messages Array of previous messages with roles
   * @returns Promise containing the assistant's response
   */
  async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages as any,
        max_tokens: 300, // Limit response length
        temperature: 0.7 // Adjust for creativity vs determinism
      });

      const responseMessage = completion.choices[0]?.message?.content || 
        "I'm sorry, I couldn't generate a response at this time.";
      
      return responseMessage;
    } catch (error) {
      console.error('Error in OpenAI API call:', error);
      throw new Error('Failed to get response from OpenAI');
    }
  }

  /**
   * Analyzes the sentiment of a user's message
   * @param message The user message to analyze
   * @returns Promise containing sentiment analysis results
   */
  async analyzeSentiment(message: string): Promise<SentimentAnalysis> {
    try {
      const systemPrompt = `
        You are a mental health assistant that analyzes the sentiment of user messages.
        Analyze the following message and return a JSON object with these fields:
        - sentiment: one of 'positive', 'negative', 'neutral', 'anxious', 'depressed', or 'stressed'
        - score: a number from -10 to 10 where -10 is extremely negative, 0 is neutral, and 10 is extremely positive
        - followUpQuestion: a thoughtful question to better understand their mental state
        - relaxationSuggestions: an array of 2-3 specific relaxation techniques that would help based on their sentiment
        - recommendTherapy: boolean indicating if they might benefit from professional therapy (true if score is below -5)
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0]?.message?.content || 
        '{"sentiment":"neutral","score":0,"followUpQuestion":"How are you feeling today?","relaxationSuggestions":["Take a few deep breaths","Go for a short walk"],"recommendTherapy":false}';
      
      return JSON.parse(responseText) as SentimentAnalysis;
    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      // Return default analysis in case of error
      return {
        sentiment: 'neutral',
        score: 0,
        followUpQuestion: "How are you feeling today?",
        relaxationSuggestions: ["Take a few deep breaths", "Practice mindfulness for 5 minutes"],
        recommendTherapy: false
      };
    }
  }

  /**
   * Set a new API key for the OpenAI client
   * @param newApiKey The new API key to use
   */
  setApiKey(newApiKey: string): void {
    this.apiKey = newApiKey;
    this.openai = new OpenAI({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true
    });
  }
}

// Export as a singleton instance
export default new OpenAIService();