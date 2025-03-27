// GifModal.jsx
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

function GifModal({ isOpen, onClose, onGifSelect }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const toast = useToast();
  const { t } = useTranslation();

  const handleSearchGif = () => {
    onGifSelect('example-gif.gif');
    toast({
      title: t('gifModal.toastAdded'),
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    onClose();
  };

  const handleUploadGif = () => {
    onGifSelect('uploaded-gif.gif');
    toast({
      title: t('gifModal.toastUploaded'),
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('gifModal.title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={2}>{t('gifModal.searchLabel')}</Text>
          <Input
            placeholder={t('gifModal.searchPlaceholder')}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            mb={3}
          />
          <Button colorScheme="primary" w="100%" mb={4} onClick={handleSearchGif}>
            {t('gifModal.searchBtn')}
          </Button>

          <Text mb={2}>{t('gifModal.uploadLabel')}</Text>
          <Button colorScheme="primary" variant="outline" w="100%" onClick={handleUploadGif}>
            {t('gifModal.uploadBtn')}
          </Button>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default GifModal;
