// src/App.js
import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import customTheme from './theme';
import CardBuilderPage from './pages/CardBuilderPage';
import LanguageSelection from './components/LanguageSelection';
import CardViewPage from './pages/CardViewPage';
import i18n from './i18n';

function App() {
  // Храним язык, если нет в localStorage, используем '' (пустую строку)
  const [language, setLanguage] = useState(localStorage.getItem('app_language') || '');

  useEffect(() => {
    if (language) {
      localStorage.setItem('app_language', language);
      i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <ChakraProvider theme={customTheme}>
      {language ? (
        <Router>
          <Routes>
            {/* Конструктор открыток */}
            <Route path="/" element={<CardBuilderPage />} />
            {/* Страница просмотра (превью) */}
            <Route path="/view" element={<CardViewPage />} />
          </Routes>
        </Router>
      ) : (
        <LanguageSelection onSelectLanguage={setLanguage} />
      )}
    </ChakraProvider>
  );
}

export default App;
