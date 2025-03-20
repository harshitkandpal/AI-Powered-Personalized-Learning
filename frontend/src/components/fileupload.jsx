import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, X } from 'lucide-react';

const FileUpload = ({ onFileChange }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    onFileChange(selectedFile);
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  const removeFile = () => {
    setFile(null);
    onFileChange(null);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Syllabus (PDF)
      </label>
      
      {!file ? (
        <div 
          className={`relative mt-1 flex flex-col items-center justify-center px-6 py-10 border-2 ${isDragging ? 'border-blue-600 bg-blue-100' : 'border-gray-300 bg-gray-50'} border-dashed rounded-xl transition-all duration-300 hover:border-blue-500 hover:bg-blue-100 shadow-sm`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="space-y-4 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-200 flex items-center justify-center">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-gray-800">Drag & Drop your file here</h4>
              <p className="text-sm text-gray-600">or click below to browse</p>
            </div>
            
            <button 
              type="button"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              onClick={() => document.getElementById('file-upload').click()}
            >
              <File className="mr-2 h-4 w-4" />
              Select PDF File
            </button>
            
            <input 
              id="file-upload" 
              name="file-upload" 
              type="file" 
              className="sr-only" 
              accept=".pdf" 
              onChange={(e) => {
                if (e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }} 
            />
            
            <p className="text-xs text-gray-500">
              PDF files up to 10MB
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-3 bg-blue-50 rounded-xl p-4 border border-blue-300 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center">
              <File className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <button 
              type="button"
              onClick={removeFile}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
              title="Remove file"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;