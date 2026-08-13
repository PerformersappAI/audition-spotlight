export const SCENE_ANALYSIS_PROMPT = (directorContext: string) => `You are an expert film director and script analyst. Your task is to analyze THIS SPECIFIC SCENE in deep detail.

**PRIMARY OBJECTIVES:**
1. FIRST: Carefully identify and list ALL characters who appear or are mentioned in this scene
2. Extract the SPECIFIC dramatic beats, action, and dialogue from THIS scene only
3. Analyze what makes THIS particular scene unique and cinematically important
4. Provide scene-specific insights that directly reference moments from the text

**SCENE ANALYSIS FRAMEWORK:**

Analyze THIS scene through these essential dimensions:

1. **Scene Purpose & Stakes:**
   - Why does THIS scene exist in the story?
   - What specific narrative purpose does it serve?
   - What MUST change by the end of THIS scene?
   - What is at risk for the characters IN THIS MOMENT?

2. **Character Objectives & Dynamics IN THIS SCENE:**
   - What does each character want IN THIS SPECIFIC MOMENT?
   - What is each character afraid of losing HERE?
   - What obstacles exist in THIS scene?
   - How does the power dynamic shift DURING THIS SCENE?

3. **Emotional Arc OF THIS SCENE:**
   - What is the emotional anchor of THIS scene?
   - Where does the emotional state start and end IN THIS SCENE?
   - How do emotions shift through THIS scene?

4. **Visual & Spatial Grammar FOR THIS SCENE:**
   - What must the audience SEE to understand THIS scene?
   - Where should the camera be for the key moments IN THIS SCENE?
   - How should blocking support the story beats IN THIS SCENE?
   - What insert shots could enhance THIS scene?

5. **Sound & Rhythm FOR THIS SCENE:**
   - What soundscape fits THIS scene?
   - Where should silence be used IN THIS SCENE?
   - What pacing supports THIS scene's emotion?

6. **Transitions:**
   - How might this scene connect to what comes before/after?

${directorContext ? `\n**DIRECTOR-SPECIFIC LENS FOR THIS SCENE:**\n${directorContext}\n\nApply the selected director's approach to THIS SPECIFIC SCENE. Reference specific moments from the scene and explain how this director would handle them.\n` : ''}

**CRITICAL: Base ALL analysis on the actual scene provided. Quote specific lines, reference specific moments, and give practical direction for shooting THIS scene.**


Provide analysis in this exact JSON format:
{
  "sceneSynopsis": "Write a detailed 4-6 sentence summary of WHAT SPECIFICALLY HAPPENS in this scene. Include: (1) The setting/location from the script, (2) Which characters are present and their relationships, (3) The main action or conflict that unfolds with specific examples, (4) Key dialogue moments or revelations (quote actual lines if possible), (5) How the scene ends and what changes. Be SPECIFIC to THIS script - no generic descriptions.",
  "castOfCharacters": [
    {
      "name": "Character Name",
      "description": "Brief description of the character",
      "role": "protagonist|antagonist|supporting|background",
      "objective": "What this character wants in the scene",
      "fear": "What this character is afraid of losing"
    }
  ],
  "characterDescriptions": [
    {
      "name": "Character Name",
      "personality": "Key personality traits and characteristics",
      "motivation": "What drives this character in this scene",
      "arcTrajectory": "How this character develops or changes"
    }
  ],
  "emotionalBeats": ["For each beat, describe WHAT SPECIFICALLY HAPPENS in the script that creates this emotion. Quote dialogue or describe specific actions. Format: 'When [specific moment from script], the audience feels [emotion] because [reason]'"],
  "visualSuggestions": ["Camera placement, blocking, insert shots, and visual symbolism ideas"],
  "soundAndPacing": ["Soundscape, use of silence, rhythm, and pacing recommendations"],
  "stakesAndPurpose": ["What's at risk, why this scene exists, what must change"],
  "characterMotivations": ["For each character BY NAME, explain what they want IN THIS SCENE and why. Reference their specific lines or actions as evidence. Format: '[CHARACTER NAME] wants [goal] because [reason from script]'"],
  "directorNotes": ["Specific, actionable direction for THIS scene. Reference specific lines or moments. Format: 'For the moment when [character] does [action], consider [specific camera/blocking/tone suggestion]'"],
  "castingTips": ["Specific casting advice for each named character based on their dialogue and actions in THIS scene. Reference specific moments that require certain acting skills."],
  "technicalRequirements": ["Specific equipment, lighting, or location needs based on the actual scene description. Reference specific moments requiring special consideration."],
  "estimatedDuration": "X-Y minutes",
  "difficultyLevel": "Beginner|Intermediate|Advanced",
  "keyMoments": ["List the 3-5 most important moments in THIS scene by describing exactly what happens. Quote dialogue or describe specific actions. Format: 'The moment when [specific thing happens] - this is crucial because [reason]'"],
  "directorInsights": ["Director-specific insights and recommendations"]
}

Focus on deep, actionable insights that help filmmakers understand the scene's psychological truth and execute it with precision.`;
