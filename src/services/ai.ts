import { theme } from '../theme/theme';

export interface AIInsight {
  insight: string;
  suggestedDuration: number;
}

export const getTaskInsight = async (taskText: string, duration: number, userProfile: any): Promise<AIInsight> => {
  try {
    const prompt = `You are the future version of ${userProfile.name}.
Dream Identity: ${userProfile.chosenIdentity}
Strengths: ${userProfile.strengths.join(', ')}
Weaknesses: ${userProfile.habits.join(', ')}
Task intended: "${taskText}" for ${duration} minutes.

Provide a short "Future You" insight (max 15 words) about how this task helps build the identity.
Also, suggest a more optimal duration in minutes if the current one is too high or low.

Return ONLY a JSON object: 
{ "insight": "string", "suggestedDuration": number }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('AI Insight Error:', error);
    return {
      insight: "Focus on the execution. Every step counts.",
      suggestedDuration: duration
    };
  }
};
