// src/pages/CardBuilderPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Textarea,
  Text,
  Container,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // <--- для перехода на другую страницу

// Иконки
import { FiVideo, FiCamera, FiImage } from 'react-icons/fi';
import { BiPalette } from 'react-icons/bi';
import { SiTensorflow } from 'react-icons/si';
import { ViewIcon } from '@chakra-ui/icons';

// Модальные окна
import AiTextModal from '../components/AiTextModal';
import VideoModal from '../components/VideoModal';
import PhotoModal from '../components/PhotoModal';
import GifModal from '../components/GifModal';
import ColorModal from '../components/ColorModal';
import PasswordProtectionModal from '../components/PasswordProtectionModal';

function CardBuilderPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); // для перехода на /view

  // Данные для открытки
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [videoSrc, setVideoSrc] = useState(null);
  const [photoSrc, setPhotoSrc] = useState(null);
  const [gifSrc, setGifSrc] = useState(null);
  const [cardColor, setCardColor] = useState('#FFF');

  // Языки
  const languages = [
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'az', label: 'Azərbaycanca', flag: '🇦🇿' },
  ];

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('app_language', lang);
  };

  // Модалки – Chakra useDisclosure
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [isGifOpen, setIsGifOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const openAiModal = () => setIsAiOpen(true);
  const closeAiModal = () => setIsAiOpen(false);

  const openVideoModal = () => setIsVideoOpen(true);
  const closeVideoModal = () => setIsVideoOpen(false);

  const openPhotoModal = () => setIsPhotoOpen(true);
  const closePhotoModal = () => setIsPhotoOpen(false);

  const openGifModal = () => setIsGifOpen(true);
  const closeGifModal = () => setIsGifOpen(false);

  const openColorModal = () => setIsColorOpen(true);
  const closeColorModal = () => setIsColorOpen(false);

  const openPasswordModal = () => setIsPasswordOpen(true);
  const closePasswordModal = () => setIsPasswordOpen(false);

  // Нажатие "Сохранить и отправить"
  const handleSaveAndSend = () => {
    openPasswordModal();
  };

  // Получаем данные из PasswordProtectionModal
  const handleConfirmPassword = (data) => {
    console.log('Password Modal Data:', data);
    alert(t('cardBuilder.sentAlert'));
  };

  // Когда нажимаем "Preview" – переходим на страницу /view
  const handlePreview = () => {
    // Определяем тип и ссылку на медиа
    let mediaType = null;
    let mediaSrc = null;

    if (videoSrc) {
      mediaType = 'video';
      mediaSrc = videoSrc;
    } else if (photoSrc) {
      mediaType = 'photo';
      mediaSrc = photoSrc;
    } else if (gifSrc) {
      mediaType = 'gif';
      mediaSrc = gifSrc;
    }

    // Собираем все данные в один объект
    const cardData = {
      senderName,
      recipientName,
      messageText,
      mediaType,
      mediaSrc,
      cardColor,
      // Здесь можно добавить пароль и подсказку, если нужно
      // password: ...,
      // passwordHint: ...
    };

    // Переходим на /view, передавая объект cardData через state
    navigate('/view', { state: { cardData } });
  };

  return (
    <Container maxW="md" py={6}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">{t('cardBuilder.heading')}</Heading>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline">
            {languages.find((lang) => lang.code === i18n.language)?.flag}
          </MenuButton>
          <MenuList>
            {languages.map((lang) => (
              <MenuItem key={lang.code} onClick={() => handleLanguageChange(lang.code)}>
                {lang.flag} {lang.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>

      <Box mb={4}>
        <Text mb={1}>{t('cardBuilder.senderLabel')}</Text>
        <Input
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          mb={2}
        />
        <Text mb={1}>{t('cardBuilder.recipientLabel')}</Text>
        <Input
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
        />
      </Box>

      <Box mb={4}>
        <Flex justify="space-between" align="center" mb={2}>
          <Text>{t('cardBuilder.messageLabel')}</Text>
          <Button
            size="sm"
            variant="outline"
            onClick={openAiModal}
            leftIcon={<SiTensorflow />}
          >
            {t('cardBuilder.generateBtn')}
          </Button>
        </Flex>
        <Textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          rows={4}
        />
      </Box>

      <Box mb={6}>
        <Text mb={2}>{t('cardBuilder.addMedia')}</Text>
        <Flex gap={2} wrap="wrap">
          <Button onClick={openVideoModal} leftIcon={<FiVideo />}>
            {t('cardBuilder.videoBtn')}
          </Button>
          <Button onClick={openPhotoModal} leftIcon={<FiCamera />}>
            {t('cardBuilder.photoBtn')}
          </Button>
          <Button onClick={openGifModal} leftIcon={<FiImage />}>
            {t('cardBuilder.gifBtn')}
          </Button>
          <Button onClick={openColorModal} leftIcon={<BiPalette />}>
            {t('cardBuilder.colorBtn')}
          </Button>
        </Flex>
      </Box>

      {/* Кнопка Preview теперь переходит на страницу CardViewPage */}
      <Button
        leftIcon={<ViewIcon />}
        mb={4}
        onClick={handlePreview}
        width="100%"
        variant="outline"
      >
        {t('cardBuilder.previewBtn')}
      </Button>

      {/* Сохранить и отправить */}
      <Button
        colorScheme="blue"
        width="100%"
        onClick={handleSaveAndSend}
      >
        {t('cardBuilder.sendBtn')}
      </Button>

      {/* Модальные окна */}
      <AiTextModal
        isOpen={isAiOpen}
        onClose={closeAiModal}
        onTextGenerated={setMessageText}
      />
      <VideoModal
        isOpen={isVideoOpen}
        onClose={closeVideoModal}
        onVideoSelect={setVideoSrc}
      />
      <PhotoModal
        isOpen={isPhotoOpen}
        onClose={closePhotoModal}
        onPhotoSelect={setPhotoSrc}
      />
      <GifModal
        isOpen={isGifOpen}
        onClose={closeGifModal}
        onGifSelect={setGifSrc}
      />
      <ColorModal
        isOpen={isColorOpen}
        onClose={closeColorModal}
        onColorSelect={setCardColor}
      />
      <PasswordProtectionModal
        isOpen={isPasswordOpen}
        onClose={closePasswordModal}
        onConfirm={handleConfirmPassword}
      />
    </Container>
  );
}

export default CardBuilderPage;
