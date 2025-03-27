import React from 'react';
import { Box, Flex, Button, VStack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'az', label: 'Azərbaycanca' },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
];

const MotionBox = motion(Box);

export default function LanguageSelection({ onSelectLanguage }) {
  const { i18n } = useTranslation();

  const handleLanguageSelect = (lang) => {
    i18n.changeLanguage(lang); // Глобальное переключение языка
    onSelectLanguage(lang);    // Передаем выбранный язык в App.js
  };

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-b, primary.50, secondary.50)"
      direction="column"
      px={4}
    >
      <MotionBox
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        mb={8}
      >
        <Text fontSize="2xl" fontWeight="bold" color="primary.600">
          Virtual Cards
        </Text>
      </MotionBox>

      <VStack spacing={4} width="100%" maxWidth="320px">
        <Text fontSize="md" fontWeight="medium" mb={2}>
          Выберите язык / Dil seçin / Choose language
        </Text>

        {languages.map((lang, index) => (
          <MotionBox
            key={lang.code}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
            width="100%"
          >
            <Button
              colorScheme="primary"
              variant="outline"
              width="100%"
              size="lg"
              borderRadius="md"
              boxShadow="md"
              onClick={() => handleLanguageSelect(lang.code)}
            >
              {lang.label}
            </Button>
          </MotionBox>
        ))}
      </VStack>
    </Flex>
  );
}
