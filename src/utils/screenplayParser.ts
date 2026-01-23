// Screenplay Parser - Supports FDX (Final Draft) and Fountain formats

export interface ParsedScreenplay {
  title: string;
  author?: string;
  scenes: ParsedScene[];
  characters: string[];
  rawText: string;
}

interface ParsedScene {
  sceneNumber: number;
  heading: string;
  location: string;
  timeOfDay: string;
  intExt: 'INT' | 'EXT' | 'INT/EXT' | '';
  content: string;
  dialogue: DialogueLine[];
  actions: string[];
}

interface DialogueLine {
  character: string;
  parenthetical?: string;
  text: string;
}

// Parse Final Draft XML (FDX) format
export const parseFDX = (xmlContent: string): ParsedScreenplay => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlContent, 'text/xml');
  
  const scenes: ParsedScene[] = [];
  const characters = new Set<string>();
  let currentScene: ParsedScene | null = null;
  let sceneNumber = 0;
  
  // Get title page info
  const titlePage = doc.querySelector('TitlePage');
  let title = 'Untitled Screenplay';
  let author = '';
  
  if (titlePage) {
    const titleContent = titlePage.querySelector('Content[Type="Title"]');
    if (titleContent) {
      title = titleContent.textContent?.trim() || title;
    }
    const authorContent = titlePage.querySelector('Content[Type="Author"]');
    if (authorContent) {
      author = authorContent.textContent?.trim() || '';
    }
  }
  
  // Parse paragraphs
  const paragraphs = doc.querySelectorAll('Paragraph');
  
  paragraphs.forEach(para => {
    const type = para.getAttribute('Type') || '';
    const textContent = para.querySelector('Text')?.textContent?.trim() || '';
    
    if (!textContent) return;
    
    switch (type) {
      case 'Scene Heading':
        // Save previous scene
        if (currentScene) {
          scenes.push(currentScene);
        }
        
        sceneNumber++;
        const { location, timeOfDay, intExt } = parseSceneHeading(textContent);
        
        currentScene = {
          sceneNumber,
          heading: textContent,
          location,
          timeOfDay,
          intExt,
          content: '',
          dialogue: [],
          actions: []
        };
        break;
        
      case 'Action':
        if (currentScene) {
          currentScene.actions.push(textContent);
          currentScene.content += textContent + '\n\n';
        }
        break;
        
      case 'Character':
        characters.add(textContent.replace(/\s*\(.*\)\s*$/, '').trim());
        if (currentScene) {
          currentScene.content += textContent + '\n';
        }
        break;
        
      case 'Dialogue':
        if (currentScene) {
          // Find the most recent character
          const lastCharIdx = currentScene.content.lastIndexOf('\n');
          const recentContent = currentScene.content.slice(0, lastCharIdx);
          const charMatch = recentContent.match(/([A-Z][A-Z\s]+)(?:\s*\(.*\))?\s*$/);
          
          if (charMatch) {
            currentScene.dialogue.push({
              character: charMatch[1].trim(),
              text: textContent
            });
          }
          currentScene.content += textContent + '\n\n';
        }
        break;
        
      case 'Parenthetical':
        if (currentScene && currentScene.dialogue.length > 0) {
          currentScene.dialogue[currentScene.dialogue.length - 1].parenthetical = textContent;
        }
        if (currentScene) {
          currentScene.content += `(${textContent})\n`;
        }
        break;
        
      case 'Transition':
        if (currentScene) {
          currentScene.content += textContent + '\n\n';
        }
        break;
    }
  });
  
  // Push last scene
  if (currentScene) {
    scenes.push(currentScene);
  }
  
  // Build raw text
  const rawText = scenes.map(scene => {
    return `${scene.heading}\n\n${scene.content}`;
  }).join('\n\n');
  
  return {
    title,
    author,
    scenes,
    characters: Array.from(characters),
    rawText
  };
};

// Parse Fountain format (plain text screenplay format)
export const parseFountain = (text: string): ParsedScreenplay => {
  const scenes: ParsedScene[] = [];
  const characters = new Set<string>();
  let currentScene: ParsedScene | null = null;
  let sceneNumber = 0;
  
  // Extract title from title page (before first blank line or scene)
  let title = 'Untitled Screenplay';
  let author = '';
  
  const titleMatch = text.match(/^Title:\s*(.+)$/mi);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }
  
  const authorMatch = text.match(/^(?:Author|Credit|By):\s*(.+)$/mi);
  if (authorMatch) {
    author = authorMatch[1].trim();
  }
  
  // Remove title page content
  const bodyStart = text.search(/^(?:INT\.|EXT\.|INT\/EXT\.|I\/E\.)/mi);
  const body = bodyStart > -1 ? text.slice(bodyStart) : text;
  
  // Split into lines
  const lines = body.split('\n');
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Scene heading
    if (/^(?:INT\.|EXT\.|INT\/EXT\.|I\/E\.|\.)/i.test(line) && !line.startsWith('..')) {
      // Save previous scene
      if (currentScene) {
        scenes.push(currentScene);
      }
      
      sceneNumber++;
      const heading = line.startsWith('.') ? line.slice(1) : line;
      const { location, timeOfDay, intExt } = parseSceneHeading(heading);
      
      currentScene = {
        sceneNumber,
        heading,
        location,
        timeOfDay,
        intExt,
        content: heading + '\n\n',
        dialogue: [],
        actions: []
      };
      i++;
      continue;
    }
    
    // Character (all caps, possibly with extension)
    if (/^[A-Z][A-Z\s]+(?:\s*\(.*\))?$/.test(line) && line.length < 50) {
      const charName = line.replace(/\s*\(.*\)\s*$/, '').trim();
      characters.add(charName);
      
      if (currentScene) {
        currentScene.content += line + '\n';
        
        // Look for dialogue on next lines
        i++;
        let parenthetical = '';
        let dialogueText = '';
        
        while (i < lines.length) {
          const nextLine = lines[i].trim();
          
          // Parenthetical
          if (nextLine.startsWith('(') && nextLine.endsWith(')')) {
            parenthetical = nextLine.slice(1, -1);
            currentScene.content += nextLine + '\n';
            i++;
            continue;
          }
          
          // Dialogue continues until blank line or scene heading
          if (nextLine === '' || /^(?:INT\.|EXT\.|INT\/EXT\.|I\/E\.)/i.test(nextLine)) {
            break;
          }
          
          // Check if it's another character
          if (/^[A-Z][A-Z\s]+(?:\s*\(.*\))?$/.test(nextLine) && nextLine.length < 50) {
            break;
          }
          
          dialogueText += (dialogueText ? ' ' : '') + nextLine;
          currentScene.content += nextLine + '\n';
          i++;
        }
        
        if (dialogueText) {
          currentScene.dialogue.push({
            character: charName,
            parenthetical: parenthetical || undefined,
            text: dialogueText
          });
        }
        currentScene.content += '\n';
        continue;
      }
    }
    
    // Action/description (anything else)
    if (line && currentScene) {
      currentScene.actions.push(line);
      currentScene.content += line + '\n';
    }
    
    i++;
  }
  
  // Push last scene
  if (currentScene) {
    scenes.push(currentScene);
  }
  
  const rawText = scenes.map(scene => scene.content).join('\n');
  
  return {
    title,
    author,
    scenes,
    characters: Array.from(characters),
    rawText
  };
};

// Helper to parse scene heading
const parseSceneHeading = (heading: string): { 
  location: string; 
  timeOfDay: string; 
  intExt: 'INT' | 'EXT' | 'INT/EXT' | '' 
} => {
  let intExt: 'INT' | 'EXT' | 'INT/EXT' | '' = '';
  let location = heading;
  let timeOfDay = '';
  
  // Extract INT/EXT
  const intExtMatch = heading.match(/^(INT\.|EXT\.|INT\/EXT\.|I\/E\.)\s*/i);
  if (intExtMatch) {
    const prefix = intExtMatch[1].toUpperCase();
    if (prefix.includes('INT') && prefix.includes('EXT')) {
      intExt = 'INT/EXT';
    } else if (prefix.includes('INT')) {
      intExt = 'INT';
    } else if (prefix.includes('EXT')) {
      intExt = 'EXT';
    }
    location = heading.slice(intExtMatch[0].length);
  }
  
  // Extract time of day
  const timeMatch = location.match(/\s*-\s*(DAY|NIGHT|DUSK|DAWN|MORNING|AFTERNOON|EVENING|CONTINUOUS|LATER|SAME)\s*$/i);
  if (timeMatch) {
    timeOfDay = timeMatch[1].toUpperCase();
    location = location.slice(0, -timeMatch[0].length);
  }
  
  return { location: location.trim(), timeOfDay, intExt };
};

// Auto-detect format and parse
export const parseScreenplay = (content: string, filename?: string): ParsedScreenplay => {
  // Check file extension
  if (filename) {
    const ext = filename.toLowerCase().split('.').pop();
    if (ext === 'fdx') {
      return parseFDX(content);
    }
    if (ext === 'fountain' || ext === 'txt') {
      return parseFountain(content);
    }
  }
  
  // Try to detect format from content
  if (content.trim().startsWith('<?xml') || content.includes('<FinalDraft')) {
    return parseFDX(content);
  }
  
  // Default to Fountain
  return parseFountain(content);
};

// Read and parse screenplay file
export const readScreenplayFile = async (file: File): Promise<ParsedScreenplay> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = parseScreenplay(content, file.name);
        resolve(parsed);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
