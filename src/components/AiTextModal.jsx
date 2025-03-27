// AiTextModal.jsx
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
  Select,
  Textarea,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  useToast,
  ButtonGroup,
  Box,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

function AiTextModal({ isOpen, onClose, onTextGenerated }) {
  const toast = useToast();
  const { t } = useTranslation();

  // Состояния для выбора языка
  const [language, setLanguage] = useState('ru');
  const [customLanguage, setCustomLanguage] = useState('');

  // Состояния для выбора случая
  const [occasion, setOccasion] = useState('День рождения');
  const [customOccasion, setCustomOccasion] = useState('');

  // Состояния для выбора, кем является получатель
  const [relation, setRelation] = useState('Друг');
  const [customRelation, setCustomRelation] = useState('');

  // Состояние выбора пола
  const [gender, setGender] = useState('female');

  // Длина текста и пользовательский ввод
  const [length, setLength] = useState('medium');
  const [additional, setAdditional] = useState('');

  // Опции и лимиты длины
  const lengthOptions = ['short', 'medium', 'long'];
  const lengthLimits = {
    short: 100,
    medium: 250,
    long: 500,
  };

  // Маппинг для преобразования кода языка в полное название
  const languageMapping = {
    ru: 'Русский',
    en: 'Английский',
    az: 'Азербайджанский',
  };

  // Функция для получения отображаемого значения длины
  const getLengthLabel = () => {
    switch (length) {
      case 'short':
        return 'Короткий';
      case 'medium':
        return 'Средний';
      case 'long':
        return 'Длинный';
      default:
        return '';
    }
  };

  const handleGenerateText = () => {
    // Проверка на заполненность кастомных полей
    if (
      (language === 'custom' && !customLanguage.trim()) ||
      (occasion === 'custom' && !customOccasion.trim()) ||
      (relation === 'custom' && !customRelation.trim())
    ) {
      toast({
        title: 'Заполните все кастомные поля',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Определяем итоговые значения, учитывая маппинг языка
    const selectedLanguage =
      language === 'custom' ? customLanguage : (languageMapping[language] || language);
    const selectedOccasion = occasion === 'custom' ? customOccasion : occasion;
    const selectedRelation = relation === 'custom' ? customRelation : relation;

    // Формируем финальный промпт
    const prompt = `Создай поздравление на языке "${selectedLanguage}" по случаю "${selectedOccasion}" для "${
      gender === 'male' ? 'мужчины' : 'женщины'
    }", являющегося "${selectedRelation}". Длина сообщения: "${length}". Используй дополнительный текст: "${additional.slice(
      0,
      lengthLimits[length]
    )}"`;

    onTextGenerated(prompt);
    toast({
      title: 'Текст успешно сформирован',
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
        <ModalHeader>{t('aiTextModal.title') || 'Создание текста для открытки'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Выбор пола получателя */}
          <FormControl mb={3}>
            <FormLabel>Пол получателя</FormLabel>
            <ButtonGroup isAttached variant="outline">
              <Button
                colorScheme={gender === 'male' ? 'blue' : 'gray'}
                onClick={() => setGender('male')}
              >
                Мужской
              </Button>
              <Button
                colorScheme={gender === 'female' ? 'pink' : 'gray'}
                onClick={() => setGender('female')}
              >
                Женский
              </Button>
            </ButtonGroup>
          </FormControl>

          {/* Выбор языка */}
          <FormControl mb={3}>
            <FormLabel>{t('aiTextModal.languageLabel') || 'Язык'}</FormLabel>
            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="ru">Русский</option>
              <option value="en">Английский</option>
              <option value="az">Азербайджанский</option>
              <option value="custom">Свой вариант</option>
            </Select>
            {language === 'custom' && (
              <Input
                mt={2}
                placeholder="Введите язык"
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
              />
            )}
          </FormControl>

          {/* Выбор случая */}
          <FormControl mb={3}>
            <FormLabel>Случай</FormLabel>
            <Select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
              <option>День рождения</option>
              <option>Признание в любви</option>
              <option>Поддержка</option>
              <option>Знакомство</option>
              <option>Юбилей</option>
              <option value="custom">Свой вариант</option>
            </Select>
            {occasion === 'custom' && (
              <Input
                mt={2}
                placeholder="Опишите случай"
                value={customOccasion}
                onChange={(e) => setCustomOccasion(e.target.value)}
              />
            )}
          </FormControl>

          {/* Кто получатель */}
          <FormControl mb={3}>
            <FormLabel>Кто получатель</FormLabel>
            <Select value={relation} onChange={(e) => setRelation(e.target.value)}>
              <option>Знакомая(ый)</option>
              <option>Товарищ</option>
              <option>Коллега</option>
              <option>Друг</option>
              <option>Любимая(ый)</option>
              <option>Семья</option>
              <option value="custom">Свой вариант</option>
            </Select>
            {relation === 'custom' && (
              <Input
                mt={2}
                placeholder="Уточните, кем приходится получатель"
                value={customRelation}
                onChange={(e) => setCustomRelation(e.target.value)}
              />
            )}
          </FormControl>

          {/* Слайдер для длины текста */}
          <FormControl mb={3}>
            <FormLabel display="flex" alignItems="center">
              <span>Длина текста:</span>
              <Box ml={2} fontWeight="bold">
                {getLengthLabel()}
              </Box>
            </FormLabel>
            <Box width="80%"> {/* Уменьшаем ширину слайдера на 20% */}
              <Slider
                min={0}
                max={2}
                step={1}
                value={lengthOptions.indexOf(length)}
                onChange={(val) => setLength(lengthOptions[val])}
              >
                <SliderTrack bg="gray.100">
                  <SliderFilledTrack bg="green.300" />
                </SliderTrack>
                <SliderThumb boxSize={5} bg="green.400" />
              </Slider>
            </Box>
          </FormControl>

          {/* Текст пользователя */}
          <FormControl>
            <FormLabel>Ваш текст</FormLabel>
            <Textarea
              placeholder="Введите дополнительный текст"
              value={additional}
              onChange={(e) => setAdditional(e.target.value)}
              maxLength={lengthLimits[length]}
            />
            <Flex justify="flex-end" fontSize="sm" color="gray.500">
              {additional.length} / {lengthLimits[length]} символов
            </Flex>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} variant="ghost" onClick={onClose}>
            {t('common.cancel') || 'Отмена'}
          </Button>
          <Button colorScheme="green" onClick={handleGenerateText}>
            {t('aiTextModal.generateBtn') || 'Сгенерировать'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AiTextModal;
