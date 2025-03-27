// src/pages/CardViewPage.jsx
import React, { useState } from 'react';
import { Container, Text, Button, Image, Input } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const MotionBox = motion.div;

function CardViewPage() {
  const { t } = useTranslation();
  const location = useLocation();
  // Если cardData не передан, устанавливаем его в null
  const cardData = location.state?.cardData || null;

  // Всегда вызываем хуки
  const [passwordInput, setPasswordInput] = useState('');
  // Если cardData не передан, считаем, что пароль не нужен (isUnlocked = true)
  const [isUnlocked, setIsUnlocked] = useState(cardData ? !cardData.password : true);
  const [error, setError] = useState('');

  // Если данных об открытке нет, выводим сообщение об ошибке
  if (!cardData) {
    return (
      <Container maxW="lg" centerContent minH="100vh" justifyContent="center">
        <Text fontSize="xl" color="red.500">
          {t('cardView.noCardData') || 'No card data provided.'}
        </Text>
      </Container>
    );
  }

  const handleUnlock = () => {
    if (passwordInput === cardData.password) {
      setIsUnlocked(true);
    } else {
      setError(t('cardView.incorrectPassword'));
    }
  };

  return (
    <Container maxW="lg" centerContent minH="100vh" justifyContent="center">
      <AnimatePresence>
        {!isUnlocked ? (
          <MotionBox
            key="lockscreen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            <Text fontSize="2xl" mb={4} fontWeight="bold" color="primary.500">
              Virtual Cards
            </Text>
            <Text mb={2}>{t('cardView.passwordPrompt')}</Text>
            {cardData.passwordHint && (
              <Text fontSize="sm" color="gray.600" mb={2}>
                {t('cardView.passwordHint')}: {cardData.passwordHint}
              </Text>
            )}
            <Input
              placeholder={t('cardView.passwordInput')}
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              mb={3}
              textAlign="center"
            />
            {error && <Text color="red.500">{error}</Text>}
            <Button colorScheme="primary" onClick={handleUnlock}>
              {t('cardView.unlockBtn')}
            </Button>
          </MotionBox>
        ) : (
          <MotionBox
            key="unlocked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              textAlign: 'center',
              background: cardData.cardColor || '#FFEDEB',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            {cardData.mediaType === 'video' && cardData.mediaSrc && (
              <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <video controls width="100%" src={cardData.mediaSrc} style={{ borderRadius: '12px' }} />
              </MotionBox>
            )}
            {cardData.mediaType !== 'video' && cardData.mediaSrc && (
              <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Image
                  src={cardData.mediaSrc}
                  alt="CardMedia"
                  borderRadius="12px"
                  width="100%"
                  mb={4}
                />
              </MotionBox>
            )}

            <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <Text whiteSpace="pre-line" fontSize="lg" my={4}>
                {cardData.messageText || t('cardBuilder.noMessage')}
              </Text>
              {cardData.senderName && (
                <Text fontStyle="italic" color="gray.600">
                  — {cardData.senderName}
                </Text>
              )}
            </MotionBox>

            <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              <Button colorScheme="primary" variant="outline" mt={6}>
                {t('cardView.replyBtn')}
              </Button>
            </MotionBox>
          </MotionBox>
        )}
      </AnimatePresence>
    </Container>
  );
}

export default CardViewPage;
