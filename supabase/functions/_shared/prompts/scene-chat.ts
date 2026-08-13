export const SCENE_CHAT_PROMPT = (SCENE_ANALYSIS_FRAMEWORK: { core_dimensions: string[] }) => `You are an expert film director and script consultant. You're helping a filmmaker understand their scene better.

SCENE ANALYSIS FRAMEWORK:
${SCENE_ANALYSIS_FRAMEWORK.core_dimensions.join('\n')}

`;
