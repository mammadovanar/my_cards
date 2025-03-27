// PhotoModal.jsx
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

function PhotoModal({ isOpen, onClose, onPhotoSelect }) {
  const toast = useToast();
  const { t } = useTranslation();

  const handleTakePhoto = () => {
    onPhotoSelect('camera-photo.jpg');
    toast({
      title: t('photoModal.toastPhotoTaken'),
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    onClose();
  };

  const handleUploadPhoto = () => {
    onPhotoSelect('uploaded-photo.jpg');
    toast({
      title: t('photoModal.toastPhotoUploaded'),
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
        <ModalHeader>{t('photoModal.title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>{t('photoModal.description')}</Text>
          <Button colorScheme="primary" mb={3} onClick={handleTakePhoto} w="100%">
            {t('photoModal.takePhotoBtn')}
          </Button>
          <Button colorScheme="primary" variant="outline" w="100%" onClick={handleUploadPhoto}>
            {t('photoModal.uploadPhotoBtn')}
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

export default PhotoModal;
