// PasswordProtectionModal.jsx
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
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

function PasswordProtectionModal({ isOpen, onClose, onConfirm }) {
  const toast = useToast();
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [hint, setHint] = useState('');
  const [isOneTime, setIsOneTime] = useState(false);

  const handleSave = () => {
    if (!password) {
      toast({
        title: t('passwordModal.toastTitle'),
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
    onConfirm({
      password: password.trim(),
      hint: hint.trim(),
      isOneTime,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('passwordModal.title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="sm" mb={3}>
            {t('passwordModal.description')}
          </Text>

          <FormControl mb={3}>
            <FormLabel>{t('passwordModal.passwordLabel')}</FormLabel>
            <Input
              type="password"
              placeholder={t('passwordModal.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>{t('passwordModal.hintLabel')}</FormLabel>
            <Input
              placeholder={t('passwordModal.hintPlaceholder')}
              value={hint}
              onChange={(e) => setHint(e.target.value)}
            />
          </FormControl>

          <Checkbox
            isChecked={isOneTime}
            onChange={(e) => setIsOneTime(e.target.checked)}
            colorScheme="primary"
          >
            {t('passwordModal.oneTimeLabel')}
          </Checkbox>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button colorScheme="primary" onClick={handleSave}>
            {t('common.save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default PasswordProtectionModal;
