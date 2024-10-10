import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Page } from '../types';

interface AddEditPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (page: Page) => void;
  editingPage: Page | null;
  isDarkMode: boolean;
}

const AddEditPageModal: React.FC<AddEditPageModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPage,
  isDarkMode,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (editingPage) {
      setTitle(editingPage.title);
      setContent(editingPage.content);
      setFile(null);
    } else {
      setTitle('');
      setContent('');
      setFile(null);
    }
  }, [editingPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title && (content || file)) {
      let pageContent = content;
      let isHtmlFile = false;

      if (file) {
        pageContent = await readFileContent(file);
        isHtmlFile = true;
      }

      const newPage: Page = {
        id: editingPage?.id || title.toLowerCase().replace(/\s+/g, '-'),
        title,
        content: pageContent,
        favorite: editingPage?.favorite || false,
        isHtmlFile,
      };
      onSave(newPage);
      onClose();
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setContent('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg w-full max-w-md`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{editingPage ? 'Edit Page' : 'Add New Page'}</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2 rounded ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
              }`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="file" className="block mb-2">
              Upload HTML File (optional)
            </label>
            <input
              type="file"
              id="file"
              accept=".html"
              onChange={handleFileChange}
              className={`w-full p-2 rounded ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
              }`}
            />
          </div>
          {!file && (
            <div className="mb-4">
              <label htmlFor="content" className="block mb-2">
                Content (HTML, CSS, and JavaScript)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full p-2 rounded ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                }`}
                rows={10}
                placeholder="Enter your HTML, CSS, and JavaScript code here"
              ></textarea>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {editingPage ? 'Update Page' : 'Add Page'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditPageModal;