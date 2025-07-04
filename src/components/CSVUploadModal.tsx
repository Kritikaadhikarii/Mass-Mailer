import React, { useState } from 'react';
import { parseCSV } from '@/utils/csvParser';

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: {name: string, email: string}[]) => void;
}

export default function CSVUploadModal({ isOpen, onClose, onUpload }: CSVUploadModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{name: string, email: string}[]>([]);
  const [file, setFile] = useState<File | null>(null);
  
  if (!isOpen) return null;
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPreview([]);
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    const selectedFile = files[0];
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file');
      return;
    }
    
    setFile(selectedFile);
    
    // Read file as text
    try {
      const text = await readFileAsText(selectedFile);
      const results = parseCSV(text);
      
      if (results.errors.length > 0) {
        setError(`Error parsing CSV: ${results.errors[0].message}`);
        return;
      }
      
      // Check if the CSV has the required columns
      const data = results.data;
      if (!data.length) {
        setError('CSV appears to be empty');
        return;
      }
      
      // Normalize column names
      const formattedData = data.map(row => {
        // Find name and email keys (case insensitive)
        const nameKey = Object.keys(row).find(key => key.toLowerCase() === 'name') || '';
        const emailKey = Object.keys(row).find(key => key.toLowerCase() === 'email') || '';
        
        if (!nameKey || !emailKey) {
          return { name: '', email: '' };
        }
        
        return {
          name: row[nameKey] || '',
          email: row[emailKey] || ''
        };
      }).filter(item => item.email);
      
      // Show preview (first 5 rows)
      setPreview(formattedData.slice(0, 5));
    } catch (error) {
      setError(`Error reading file: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };
  
  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    
    try {
      const text = await readFileAsText(file);
      const results = parseCSV(text);
      
      if (results.errors.length > 0) {
        setError(`Error parsing CSV: ${results.errors[0].message}`);
        return;
      }
      
      // Normalize column names
      const formattedData = results.data.map(row => {
        // Find name and email keys (case insensitive)
        const nameKey = Object.keys(row).find(key => key.toLowerCase() === 'name') || '';
        const emailKey = Object.keys(row).find(key => key.toLowerCase() === 'email') || '';
        
        if (!nameKey || !emailKey) {
          return { name: '', email: '' };
        }
        
        return {
          name: row[nameKey] || '',
          email: row[emailKey] || ''
        };
      }).filter(item => item.email); // Only keep rows with email addresses
      
      onUpload(formattedData);
    } catch (error) {
      setError(`Error processing file: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Upload Recipients from CSV</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Upload a CSV file with columns for "name" and "email". 
            Each row should contain a recipient's information.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Select CSV File
            </label>
            <p className="mt-2 text-sm text-gray-500">
              {file ? `Selected: ${file.name}` : 'No file selected'}
            </p>
          </div>
        </div>
        
        {preview.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Preview (first 5 rows):</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{row.name}</td>
                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{row.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#7478E1] hover:bg-[#5A5ED9] text-white font-medium rounded-md disabled:opacity-50"
            disabled={!file}
          >
            Import Recipients
          </button>
        </div>
      </div>
    </div>
  );
}
