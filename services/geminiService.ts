
import { GoogleGenAI, Type } from "@google/genai";
import type { Event, DayOfWeek } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const scheduleSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: 'The title of the event or task.',
      },
      day: {
        type: Type.STRING,
        description: 'The day of the week for the event. Must be one of: "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday".',
      },
      startTime: {
        type: Type.STRING,
        description: 'The start time of the event in 24-hour HH:mm format (e.g., "09:00", "14:30").',
      },
      endTime: {
        type: Type.STRING,
        description: 'The end time of the event in 24-hour HH:mm format (e.g., "11:00", "15:00").',
      },
    },
    required: ['title', 'day', 'startTime', 'endTime'],
  },
};

type GeneratedEvent = Omit<Event, 'id' | 'color'>;

export const generateSchedule = async (prompt: string, existingEvents: Event[]): Promise<GeneratedEvent[]> => {
  try {
    const systemInstruction = `You are a timetable scheduling assistant. Based on the user's list of tasks and an existing schedule, generate a new schedule in JSON format.
- The working hours are from 06:00 to 23:00. Do not schedule events outside these hours.
- Avoid any time conflicts with the provided existing schedule.
- Ensure the end time is always after the start time.
- The output must be a valid JSON array of event objects.
- Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}.

Existing schedule to avoid conflicts with:
${existingEvents.length > 0 ? JSON.stringify(existingEvents.map(e => ({title: e.title, day: e.day, startTime: e.startTime, endTime: e.endTime}))) : "The schedule is currently empty."}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a schedule for the following tasks: ${prompt}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: scheduleSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      console.warn("Gemini returned an empty response.");
      return [];
    }
    
    const generatedEvents = JSON.parse(jsonText) as GeneratedEvent[];
    
    // Basic validation of the returned data
    return generatedEvents.filter(event => 
        event.title && 
        event.day && 
        event.startTime && 
        event.endTime
    );

  } catch (error) {
    console.error("Error generating schedule with Gemini API:", error);
    throw new Error("Failed to generate schedule. The AI might be unavailable or the request was invalid.");
  }
};
