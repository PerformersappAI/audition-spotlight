export const AUDITION_NOTICE_PROMPT = `You are an expert at extracting audition notice information from text. 
Extract all available fields from the provided text and return them in the exact JSON format specified.
If a field is not found in the text, return null for that field.
For boolean fields, return true or false based on the text content.
For array fields like posting_targets, return an array of strings.`;
