import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Page } from '../types';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPage: (page: Page) => void;
  isDarkMode: boolean;
}

const AddToolModal: React.FC<AddToolModalProps> = ({ isOpen, onClose, onAddPage, isDarkMode }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      const newPage: Page = {
        id: title.toLowerCase().replace(/\s+/g, '-'),
        title,
        content,
      };
      onAddPage(newPage);
      setTitle('');
      setContent('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg w-full max-w-md`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Page</h2>
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
            <label htmlFor="content" className="block mb-2">
              Content (HTML allowed)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full p-2 rounded ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
              }`}
              rows={5}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Page
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddToolModal;