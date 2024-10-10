import React, { useState } from 'react';
import { X, Plus, Search, Star, Edit, Trash2 } from 'lucide-react';
import { Page } from '../types';

interface NavigationProps {
  pages: Page[];
  currentPage: string;
  setCurrentPage: (id: string) => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  isDarkMode: boolean;
  onAddNewPage: () => void;
  onEditPage: (page: Page) => void;
  onDeletePage: (pageId: string) => void;
  onToggleFavorite: (pageId: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  pages,
  currentPage,
  setCurrentPage,
  isMenuOpen,
  toggleMenu,
  isDarkMode,
  onAddNewPage,
  onEditPage,
  onDeletePage,
  onToggleFavorite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoritePages = filteredPages.filter(page => page.favorite);
  const nonFavoritePages = filteredPages.filter(page => !page.favorite);

  const navClasses = `md:w-1/4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded shadow ${
    isMenuOpen ? 'block' : 'hidden md:block'
  }`;

  return (
    <nav className={navClasses}>
      <div className="flex justify-between items-center md:hidden">
        <h2 className="text-xl font-bold">Menu</h2>
        <button onClick={toggleMenu}>
          <X size={24} />
        </button>
      </div>
      <div className="mt-4 mb-4 relative">
        <input
          type="text"
          placeholder="Search pages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-2 rounded ${
            isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
          }`}
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
      </div>
      <div className="mb-4">
        <button
          onClick={onAddNewPage}
          className="flex items-center justify-center p-2 rounded bg-green-500 text-white hover:bg-green-600 w-full"
        >
          <Plus size={20} className="mr-2" />
          Add New Page
        </button>
      </div>
      {favoritePages.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Favorites</h3>
          <ul className="space-y-2">
            {favoritePages.map((page) => (
              <PageItem
                key={page.id}
                page={page}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onEditPage={onEditPage}
                onDeletePage={onDeletePage}
                onToggleFavorite={onToggleFavorite}
                isDarkMode={isDarkMode}
              />
            ))}
          </ul>
        </div>
      )}
      <div>
        <h3 className="font-bold mb-2">All Pages</h3>
        <ul className="space-y-2">
          {nonFavoritePages.map((page) => (
            <PageItem
              key={page.id}
              page={page}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              onEditPage={onEditPage}
              onDeletePage={onDeletePage}
              onToggleFavorite={onToggleFavorite}
              isDarkMode={isDarkMode}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
};

interface PageItemProps {
  page: Page;
  currentPage: string;
  setCurrentPage: (id: string) => void;
  onEditPage: (page: Page) => void;
  onDeletePage: (pageId: string) => void;
  onToggleFavorite: (pageId: string) => void;
  isDarkMode: boolean;
}

const PageItem: React.FC<PageItemProps> = ({
  page,
  currentPage,
  setCurrentPage,
  onEditPage,
  onDeletePage,
  onToggleFavorite,
  isDarkMode,
}) => {
  return (
    <li
      className={`flex items-center justify-between p-2 rounded ${
        currentPage === page.id
          ? 'bg-blue-600 text-white'
          : isDarkMode
          ? 'hover:bg-gray-700'
          : 'hover:bg-gray-100'
      }`}
    >
      <button
        onClick={() => setCurrentPage(page.id)}
        className="flex-grow text-left"
      >
        {page.title}
      </button>
      <div className="flex items-center space-x-2">
        <button onClick={() => onToggleFavorite(page.id)}>
          <Star size={20} className={page.favorite ? 'text-yellow-400' : 'text-gray-400'} />
        </button>
        <button onClick={() => onEditPage(page)}>
          <Edit size={20} />
        </button>
        <button onClick={() => onDeletePage(page.id)}>
          <Trash2 size={20} />
        </button>
      </div>
    </li>
  );
};

export default Navigation;