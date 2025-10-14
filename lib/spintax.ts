/**
 * Spintax Parser and Resolver
 * Handles spintax format: {option1|option2|option3}
 */

export class Spintax {
  private pattern = /\{([^{}]*)\}/g;

  /**
   * Resolve spintax by randomly picking one option
   * Example: "{Hello|Hi|Hey}" -> "Hello" or "Hi" or "Hey"
   */
  resolve(text: string): string {
    return text.replace(this.pattern, (match, options) => {
      const choices = options.split('|').map((s: string) => s.trim());
      return choices[Math.floor(Math.random() * choices.length)];
    });
  }

  /**
   * Parse spintax and return all variations
   * Example: "{Hello|Hi} {World|Universe}" -> ["Hello World", "Hello Universe", "Hi World", "Hi Universe"]
   * Limited to 100 variations to avoid memory issues
   */
  getAllVariations(text: string): string[] {
    const spintaxBlocks: string[][] = [];
    const parts: string[] = [];
    let lastIndex = 0;

    // Find all spintax blocks
    text.replace(this.pattern, (match, options, offset) => {
      // Add text before spintax
      if (offset > lastIndex) {
        parts.push(text.substring(lastIndex, offset));
      }

      // Add spintax options
      const choices = options.split('|').map((s: string) => s.trim());
      spintaxBlocks.push(choices);
      parts.push('SPINTAX_' + (spintaxBlocks.length - 1));

      lastIndex = offset + match.length;
      return match;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // If no spintax found, return original
    if (spintaxBlocks.length === 0) {
      return [text];
    }

    // Generate all combinations (limit to 100 to avoid memory issues)
    const variations: string[] = [];
    const maxVariations = Math.min(
      spintaxBlocks.reduce((acc, block) => acc * block.length, 1),
      100
    );

    for (let i = 0; i < maxVariations; i++) {
      let result = '';
      let variantIndex = i;

      for (const part of parts) {
        if (part.startsWith('SPINTAX_')) {
          const blockIndex = parseInt(part.replace('SPINTAX_', ''));
          const block = spintaxBlocks[blockIndex];
          const choice = block[variantIndex % block.length];
          result += choice;
          variantIndex = Math.floor(variantIndex / block.length);
        } else {
          result += part;
        }
      }

      variations.push(result);
    }

    return [...new Set(variations)]; // Remove duplicates
  }

  /**
   * Count number of spintax blocks
   */
  countSpintax(text: string): number {
    const matches = text.match(this.pattern);
    return matches ? matches.length : 0;
  }

  /**
   * Highlight spintax for display
   * Returns array of segments: { text: string, isSpintax: boolean }
   */
  highlight(text: string): Array<{ text: string; isSpintax: boolean }> {
    const segments: Array<{ text: string; isSpintax: boolean }> = [];
    let lastIndex = 0;

    text.replace(this.pattern, (match, options, offset) => {
      // Add text before spintax
      if (offset > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, offset),
          isSpintax: false
        });
      }

      // Add spintax
      segments.push({
        text: match,
        isSpintax: true
      });

      lastIndex = offset + match.length;
      return match;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        isSpintax: false
      });
    }

    return segments;
  }

  /**
   * Validate spintax syntax
   */
  validate(text: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for unbalanced braces
    const openBraces = (text.match(/\{/g) || []).length;
    const closeBraces = (text.match(/\}/g) || []).length;

    if (openBraces !== closeBraces) {
      errors.push(`Unbalanced braces: ${openBraces} open, ${closeBraces} close`);
    }

    // Check for nested spintax (not supported)
    if (/\{[^}]*\{/.test(text)) {
      errors.push('Nested spintax is not supported');
    }

    // Check for empty options
    if (/\{\s*\|\s*\}/.test(text)) {
      errors.push('Empty spintax options found');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Extract all spintax options from text
   * Returns array of arrays, each inner array contains options for one spintax block
   */
  extractOptions(text: string): string[][] {
    const options: string[][] = [];
    
    text.replace(this.pattern, (match, opts) => {
      const choices = opts.split('|').map((s: string) => s.trim());
      options.push(choices);
      return match;
    });

    return options;
  }

  /**
   * Get estimated number of possible variations
   */
  getVariationCount(text: string): number {
    const options = this.extractOptions(text);
    if (options.length === 0) return 1;
    
    return options.reduce((acc, opts) => acc * opts.length, 1);
  }
}

// Singleton instance
export const spintax = new Spintax();
