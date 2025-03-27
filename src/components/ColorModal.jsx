// ColorModal.jsx
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
  SimpleGrid,
  Box,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

function ColorModal({ isOpen, onClose, onColorSelect }) {
  const { t } = useTranslation();
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');

  const colors = [
    '#FFFFFF',
    '#FFEDEB', 
    '#FFCFCB', 
    '#FFF9E6',
    '#EBF8FF',
    '#E6FFFA',
  ];

  const handleSaveColor = () => {
    onColorSelect(selectedColor);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('colorModal.title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={3} spacing={3}>
            {colors.map((color) => (
              <Box
                key={color}
                bg={color}
                height="50px"
                borderRadius="md"
                cursor="pointer"
                border={selectedColor === color ? '2px solid #FF6E6B' : '1px solid #ccc'}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3}>
            {t('common.cancel')}
          </Button>
          <Button colorScheme="primary" onClick={handleSaveColor}>
            {t('common.save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ColorModal;
