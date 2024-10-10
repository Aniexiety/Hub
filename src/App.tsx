import React, { useState, useEffect } from 'react';
import { Menu, Moon, Sun, Download, Upload } from 'lucide-react';
import Navigation from './components/Navigation';
import ContentArea from './components/ContentArea';
import AddEditPageModal from './components/AddEditPageModal';
import { Page } from './types';

function App() {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);

  useEffect(() => {
    loadPagesFromStorage();
  }, []);

  const loadPagesFromStorage = () => {
    const storedPages = JSON.parse(localStorage.getItem('pages') || '[]');
    if (storedPages.length === 0) {
      const defaultPages: Page[] = [
        { id: 'home', title: 'Home', content: 'Welcome to my personal website!', favorite: false },
        { id: 'about', title: 'About', content: 'This is the about page.', favorite: false },
        { id: 'projects', title: 'Projects', content: 'Here are my projects.', favorite: false },
      ];
      setPages(defaultPages);
      localStorage.setItem('pages', JSON.stringify(defaultPages));
    } else {
      setPages(storedPages);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setEditingPage(null);
  };

  const addOrUpdatePage = (page: Page) => {
    const updatedPages = editingPage
      ? pages.map(p => p.id === page.id ? page : p)
      : [...pages, page];
    setPages(updatedPages);
    localStorage.setItem('pages', JSON.stringify(updatedPages));
    setIsModalOpen(false);
    setEditingPage(null);
  };

  const deletePage = (pageId: string) => {
    const updatedPages = pages.filter(p => p.id !== pageId);
    setPages(updatedPages);
    localStorage.setItem('pages', JSON.stringify(updatedPages));
    if (currentPage === pageId) {
      setCurrentPage('home');
    }
  };

  const toggleFavorite = (pageId: string) => {
    const updatedPages = pages.map(p =>
      p.id === pageId ? { ...p, favorite: !p.favorite } : p
    );
    setPages(updatedPages);
    localStorage.setItem('pages', JSON.stringify(updatedPages));
  };

  const exportData = () => {
    const data = JSON.stringify({ pages });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'personal_hub_data.json';
    a.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setPages(data.pages);
          localStorage.setItem('pages', JSON.stringify(data.pages));
        } catch (error) {
          console.error('Error importing data:', error);
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-blue-600'} text-white p-4`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Personal Hub</h1>
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="p-2 rounded hover:bg-opacity-20 hover:bg-white">
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button onClick={exportData} className="p-2 rounded hover:bg-opacity-20 hover:bg-white">
              <Download size={24} />
            </button>
            <label className="p-2 rounded hover:bg-opacity-20 hover:bg-white cursor-pointer">
              <Upload size={24} />
              <input type="file" className="hidden" onChange={importData} accept=".json" />
            </label>
            <button onClick={toggleMenu} className="md:hidden p-2 rounded hover:bg-opacity-20 hover:bg-white">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      <div className="container mx-auto mt-4 flex flex-col md:flex-row">
        <Navigation
          pages={pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          isDarkMode={isDarkMode}
          onAddNewPage={toggleModal}
          onEditPage={(page) => {
            setEditingPage(page);
            setIsModalOpen(true);
          }}
          onDeletePage={deletePage}
          onToggleFavorite={toggleFavorite}
        />
        <ContentArea pages={pages} currentPage={currentPage} isDarkMode={isDarkMode} />
      </div>
      <AddEditPageModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        onSave={addOrUpdatePage}
        editingPage={editingPage}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default App;