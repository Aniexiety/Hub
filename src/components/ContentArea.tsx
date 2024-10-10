import React from 'react';
import { Page } from '../types';

interface ContentAreaProps {
  pages: Page[];
  currentPage: string;
  isDarkMode: boolean;
}

const ContentArea: React.FC<ContentAreaProps> = ({ pages, currentPage, isDarkMode }) => {
  const currentPageData = pages.find((page) => page.id === currentPage);

  if (!currentPageData) {
    return (
      <main className={`md:w-3/4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded shadow mt-4 md:mt-0 md:ml-4`}>
        <h2 className="text-2xl font-bold mb-4">Page not found</h2>
      </main>
    );
  }

  if (currentPageData.isHtmlFile) {
    return (
      <main className="md:w-3/4 bg-white p-0 rounded shadow mt-4 md:mt-0 md:ml-4 h-full">
        <iframe
          srcDoc={currentPageData.content}
          title={currentPageData.title}
          className="w-full h-full border-none"
          sandbox="allow-scripts"
        />
      </main>
    );
  }

  return (
    <main className={`md:w-3/4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded shadow mt-4 md:mt-0 md:ml-4`}>
      <h2 className="text-2xl font-bold mb-4">{currentPageData.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: currentPageData.content }}></div>
    </main>
  );
};

export default ContentArea;