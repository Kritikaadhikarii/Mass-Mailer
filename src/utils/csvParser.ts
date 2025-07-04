/**
 * Simple CSV parser utility since PapaParse couldn't be installed
 */

export interface CSVParseResult {
  data: Record<string, string>[];
  errors: { message: string }[];
}

export function parseCSV(csvText: string): CSVParseResult {
  const result: CSVParseResult = {
    data: [],
    errors: []
  };

  try {
    // Split by line breaks
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      result.errors.push({ message: "CSV file appears to be empty" });
      return result;
    }

    // Parse header row
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Check if required headers exist
    const nameIndex = headers.findIndex(h => 
      h.toLowerCase() === 'name' || h.toLowerCase() === 'fullname' || h.toLowerCase() === 'full name');
    const emailIndex = headers.findIndex(h => 
      h.toLowerCase() === 'email' || h.toLowerCase() === 'e-mail' || h.toLowerCase() === 'emailaddress');
    
    if (nameIndex === -1 || emailIndex === -1) {
      result.errors.push({ message: 'CSV must contain "name" and "email" columns' });
      return result;
    }
    
    // Process data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle quoted fields properly
      const values: string[] = [];
      let inQuote = false;
      let currentValue = '';
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Don't forget to add the last value
      values.push(currentValue.trim());
      
      // Create row object
      const row: Record<string, string> = {};
      
      for (let j = 0; j < headers.length; j++) {
        if (j < values.length) {
          const value = values[j].replace(/^"|"$/g, ''); // Remove surrounding quotes
          row[headers[j]] = value;
        } else {
          row[headers[j]] = '';
        }
      }
      
      // Add to result data
      result.data.push(row);
    }
    
  } catch (error) {
    result.errors.push({ message: `Error parsing CSV: ${error instanceof Error ? error.message : String(error)}` });
  }
  
  return result;
}
