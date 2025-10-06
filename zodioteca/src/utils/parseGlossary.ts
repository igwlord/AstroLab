import { logger } from './logger';
import type { GlossaryEntry } from '../types/glossary';
import { categorizeEntry } from '../types/glossary';

/**
 * Parses the markdown glossary file and extracts structured entries
 */
export class GlossaryParser {
  private content: string;
  private entries: GlossaryEntry[] = [];

  constructor(markdownContent: string) {
    this.content = markdownContent;
  }

  /**
   * Parse the entire markdown content into structured entries
   */
  parse(): GlossaryEntry[] {
    if (this.entries.length > 0) {
      return this.entries;
    }

    // Split content by main headers (##)
    const sections = this.content.split(/^## /gm).filter(section => section.trim().length > 0);
    
    this.entries = sections.map((section) => {
      return this.parseSection(section);
    }).filter(entry => entry !== null) as GlossaryEntry[];

    return this.entries;
  }

  /**
   * Parse a single section into a GlossaryEntry
   */
  private parseSection(section: string): GlossaryEntry | null {
    const lines = section.trim().split('\n');
    if (lines.length === 0) return null;

    // Extract title (first line, remove markdown symbols)
    const title = lines[0].replace(/[#♈♉♊♋♌♍♎♏♐♑♒♓]/g, '').trim();
    if (!title) return null;

    // Generate ID from title
    const id = this.generateId(title);

    // Extract structured data
    const extractedData = this.extractStructuredData(section);

    // Extract search terms
    const searchTerms = this.extractSearchTerms(title, section);

    // Determine category
    const category = categorizeEntry(title, section);

    return {
      id,
      title,
      category,
      content: section,
      ...extractedData,
      searchTerms
    };
  }

  /**
   * Extract structured data from section content
   */
  private extractStructuredData(content: string): Partial<GlossaryEntry> {
    const data: Partial<GlossaryEntry> = {};

    // Extract dates (for zodiac signs)
    const datesMatch = content.match(/\*\*Fechas aproximadas:\*\* ([^\n]+)/);
    if (datesMatch) {
      data.dates = datesMatch[1].trim();
    }

    // Extract element
    const elementMatch = content.match(/\*\*Elemento:\*\* ([^\n]+)/);
    if (elementMatch) {
      data.element = elementMatch[1].trim();
    }

    // Extract modality
    const modalityMatch = content.match(/\*\*Modalidad:\*\* ([^\n]+)/);
    if (modalityMatch) {
      data.modality = modalityMatch[1].trim();
    }

    // Extract ruler
    const rulerMatch = content.match(/\*\*Regente:\*\* ([^\n]+)/);
    if (rulerMatch) {
      data.ruler = rulerMatch[1].trim();
    }

    // Extract symbol
    const symbolMatch = content.match(/\*\*Símbolo:\*\* ([^\n]+)/);
    if (symbolMatch) {
      data.symbol = symbolMatch[1].trim();
    }

    // Extract key energy
    const keyEnergyMatch = content.match(/\*\*Energía clave:\*\*\s*([^*]+)/);
    if (keyEnergyMatch) {
      data.keyEnergy = keyEnergyMatch[1].trim();
    }

    // Extract characteristics
    data.characteristics = this.extractCharacteristics(content);

    // Extract compatibility (for signs)
    data.compatibility = this.extractCompatibility(content);

    // Extract holistic practice
    data.practice = this.extractPractice(content);

    return data;
  }

  /**
   * Extract characteristics (strengths and challenges)
   */
  private extractCharacteristics(content: string): { strengths?: string[]; challenges?: string[] } | undefined {
    const characteristics: { strengths?: string[]; challenges?: string[] } = {};

    // Extract strengths
    const strengthsMatch = content.match(/\*\*Fortalezas:\*\* ([^*]+)/);
    if (strengthsMatch) {
      characteristics.strengths = strengthsMatch[1]
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }

    // Extract challenges
    const challengesMatch = content.match(/\*\*Desafíos:\*\* ([^*]+)/);
    if (challengesMatch) {
      characteristics.challenges = challengesMatch[1]
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }

    return Object.keys(characteristics).length > 0 ? characteristics : undefined;
  }

  /**
   * Extract compatibility information
   */
  private extractCompatibility(content: string): { harmonizes?: string[]; learns?: string[]; integrates?: string[] } | undefined {
    const compatibility: { harmonizes?: string[]; learns?: string[]; integrates?: string[] } = {};

    // Extract harmonizes
    const harmonizesMatch = content.match(/\*\*Armoniza con:\*\* ([^*]+)/);
    if (harmonizesMatch) {
      compatibility.harmonizes = this.parseCompatibilityList(harmonizesMatch[1]);
    }

    // Extract learns from
    const learnsMatch = content.match(/\*\*Aprende de:\*\* ([^*]+)/);
    if (learnsMatch) {
      compatibility.learns = this.parseCompatibilityList(learnsMatch[1]);
    }

    // Extract integrates with effort
    const integratesMatch = content.match(/\*\*Integra con esfuerzo:\*\* ([^*]+)/);
    if (integratesMatch) {
      compatibility.integrates = this.parseCompatibilityList(integratesMatch[1]);
    }

    return Object.keys(compatibility).length > 0 ? compatibility : undefined;
  }

  /**
   * Parse compatibility list text
   */
  private parseCompatibilityList(text: string): string[] {
    return text
      .replace(/\([^)]+\)/g, '') // Remove parentheses content
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  /**
   * Extract holistic practice information
   */
  private extractPractice(content: string): { description?: string; chakra?: string; frequency?: string; duration?: string } | undefined {
    if (!content.includes('Práctica holística breve:')) {
      return undefined;
    }

    const practice: { description?: string; chakra?: string; frequency?: string; duration?: string } = {};

    // Extract practice section
    const practiceMatch = content.match(/\*\*Práctica holística breve:\*\*([\s\S]*?)(?=---|\n##|$)/);
    if (practiceMatch) {
      const practiceContent = practiceMatch[1];

      // Extract chakra and frequency
      const chakraFrequencyMatch = practiceContent.match(/\*\*Chakra & frecuencia[^:]*:\*\* ([^(]+)\(([^)]+)\)[^(]*\(([^)]+)\)/);
      if (chakraFrequencyMatch) {
        practice.chakra = chakraFrequencyMatch[1].trim();
        practice.frequency = chakraFrequencyMatch[2].trim();
        practice.duration = chakraFrequencyMatch[3].trim();
      }

      // Extract general description (first bullet point usually)
      const descriptionMatch = practiceContent.match(/\* \*\*([^*]+)\*\* ([^*\n]+)/);
      if (descriptionMatch) {
        practice.description = `${descriptionMatch[1]}: ${descriptionMatch[2].trim()}`;
      }
    }

    return Object.keys(practice).length > 0 ? practice : undefined;
  }

  /**
   * Extract search terms from title and content
   */
  private extractSearchTerms(title: string, content: string): string[] {
    const terms = new Set<string>();

    // Add title
    terms.add(title.toLowerCase());

    // Add title variations
    title.split(' ').forEach(word => {
      if (word.length > 2) {
        terms.add(word.toLowerCase());
      }
    });

    // Extract terms from content
    const boldTerms = content.match(/\*\*([^*]+)\*\*/g);
    if (boldTerms) {
      boldTerms.forEach(term => {
        const cleanTerm = term.replace(/\*\*/g, '').toLowerCase();
        if (cleanTerm.length > 2 && !cleanTerm.includes(':')) {
          terms.add(cleanTerm);
        }
      });
    }

    // Add specific astrological terms
    const astroTerms = ['carta natal', 'signo', 'planeta', 'casa', 'aspecto', 'trígono', 'cuadratura', 'conjunción'];
    astroTerms.forEach(term => {
      if (content.toLowerCase().includes(term)) {
        terms.add(term);
      }
    });

    return Array.from(terms);
  }

  /**
   * Generate a unique ID from title
   */
  private generateId(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  /**
   * Search entries by term
   */
  search(term: string): GlossaryEntry[] {
    const searchTerm = term.toLowerCase().trim();
    if (!searchTerm) return this.entries;

    return this.entries.filter(entry => 
      entry.searchTerms.some(searchTerm => searchTerm.includes(term.toLowerCase())) ||
      entry.title.toLowerCase().includes(searchTerm) ||
      entry.content.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Filter entries by category
   */
  filterByCategory(category: string): GlossaryEntry[] {
    if (category === 'all') return this.entries;
    return this.entries.filter(entry => entry.category === category);
  }

  /**
   * Get all entries
   */
  getAllEntries(): GlossaryEntry[] {
    return this.entries;
  }

  /**
   * Get entry by ID
   */
  getEntryById(id: string): GlossaryEntry | undefined {
    return this.entries.find(entry => entry.id === id);
  }
}

/**
 * Create parser instance and load glossary content
 */
export const createGlossaryParser = async (): Promise<GlossaryParser> => {
  try {
    const response = await fetch('/glosario.md');
    const content = await response.text();
    return new GlossaryParser(content);
  } catch (error) {
    logger.error('Error loading glossary:', error);
    // Return parser with empty content as fallback
    return new GlossaryParser('');
  }
};

export default GlossaryParser;
