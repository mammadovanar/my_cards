// VideoModal.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  Box,
  Flex,
  useToast,
  Progress,
  CircularProgress,
  CircularProgressLabel,
  IconButton,
  Divider
} from '@chakra-ui/react';
import { CloseIcon, RepeatIcon } from '@chakra-ui/icons';
import { MdCameraswitch, MdMic, MdMicOff } from 'react-icons/md';

const DB_NAME = 'VideoMessagesDB';
const STORE_NAME = 'videos';
const VIDEO_KEY = 'my_card_video';

export default function VideoModal({ isOpen, onClose, onVideoSelect }) {
  const toast = useToast();

  // ШАГИ: record | preview | upload | success
  const [step, setStep] = useState('record');

  // Параметры камеры и микрофона
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  // Рефы для записи
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Состояния для записи
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoURL, setVideoURL] = useState('');

  // Таймер (максимум 30 сек)
  const MAX_RECORD_SECONDS = 30;
  const [timeLeft, setTimeLeft] = useState(MAX_RECORD_SECONDS);

  // Имитация «загрузки»
  const [uploadProgress, setUploadProgress] = useState(0);

  // Оборачиваем в useCallback для стабильности ссылки
  const resetRecordingStates = useCallback(() => {
    setVideoBlob(null);
    setVideoURL('');
    chunksRef.current = [];
  }, []);

  const loadVideoFromIndexedDB = useCallback(() => {
    const openReq = indexedDB.open(DB_NAME, 1);
    openReq.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    openReq.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(VIDEO_KEY);
      getReq.onsuccess = (evt) => {
        const record = evt.target.result;
        if (record && record.blob) {
          // Нашли ранее записанное видео
          setVideoBlob(record.blob);
          const url = URL.createObjectURL(record.blob);
          setVideoURL(url);
          setStep('preview'); // Переходим в режим предпросмотра
          if (onVideoSelect) onVideoSelect(url);
        } else {
          resetRecordingStates();
          setStep('record');
        }
      };
    };
    openReq.onerror = (err) => {
      console.error('IndexedDB open error:', err);
      resetRecordingStates();
      setStep('record');
    };
  }, [onVideoSelect, resetRecordingStates]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  }, [isRecording]);

  // При открытии модалки загружаем видео из IndexedDB, если есть
  useEffect(() => {
    if (isOpen) {
      loadVideoFromIndexedDB();
    } else {
      stopStream();
    }
  }, [isOpen, loadVideoFromIndexedDB]);

  // Таймер записи
  useEffect(() => {
    let timerId;
    if (isRecording) {
      timerId = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isRecording, stopRecording]);

  async function startRecording() {
    try {
      resetRecordingStates();
      setStep('record');

      const constraints = {
        video: { facingMode: isFrontCamera ? 'user' : 'environment' },
        audio: isMicOn
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data?.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      mediaRecorderRef.current.onstop = handleRecordingStop;

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTimeLeft(MAX_RECORD_SECONDS);
    } catch (error) {
      console.error('Ошибка доступа к камере/микрофону:', error);
      toast({
        title: 'Не удалось получить доступ к камере или микрофону',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  }

  function handleRecordingStop() {
    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    setVideoBlob(blob);
    const url = URL.createObjectURL(blob);
    setVideoURL(url);

    // Сохраняем в IndexedDB сразу после остановки записи
    saveVideoToIndexedDB(blob);
    if (onVideoSelect) onVideoSelect(url);

    stopStream();
    setStep('preview');
  }

  function stopStream() {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }

  function saveVideoToIndexedDB(blob) {
    const openReq = indexedDB.open(DB_NAME, 1);
    openReq.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    openReq.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ id: VIDEO_KEY, blob });
    };
    openReq.onerror = (err) => {
      console.error('IndexedDB error:', err);
    };
  }

  // «ЗАГРУЗКА» (фейк)
  function startUpload() {
    if (!videoBlob) return;
    setStep('upload');
    fakeUpload();
  }

  function fakeUpload() {
    setUploadProgress(0);
    let progress = 0;
    const intervalId = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(intervalId);
        setStep('success');
      }
    }, 400);
  }

  function cancelUpload() {
    setStep('preview');
    setUploadProgress(0);
  }

  function resetAll() {
    stopStream();
    resetRecordingStates();
    setIsRecording(false);
    setTimeLeft(MAX_RECORD_SECONDS);
    setUploadProgress(0);
  }

  function handleReRecord() {
    resetAll();
    startRecording();
  }

  // Рендер шагов
  function renderRecordStep() {
    return (
      <Box textAlign="center" pb={4}>
        <Box position="relative" bg="black" borderRadius="md" overflow="hidden">
          <video
            ref={videoRef}
            style={{ width: '100%', height: 'auto' }}
            muted
            autoPlay
          />
          {isRecording && (
            <Progress
              size="xs"
              value={((MAX_RECORD_SECONDS - timeLeft) / MAX_RECORD_SECONDS) * 100}
              colorScheme="red"
              position="absolute"
              top="0"
              left="0"
              right="0"
            />
          )}
        </Box>
        <Flex justify="center" align="center" mt={2} mb={2} gap={3}>
          <IconButton
            aria-label="Переключить камеру"
            icon={<MdCameraswitch />}
            onClick={() => setIsFrontCamera(!isFrontCamera)}
            variant="outline"
          />
          <IconButton
            aria-label="Переключить микрофон"
            icon={isMicOn ? <MdMic /> : <MdMicOff />}
            onClick={() => setIsMicOn(!isMicOn)}
            variant="outline"
          />
        </Flex>
        <Text fontSize="sm" color="gray.500" mb={1}>
          Осталось: {timeLeft} сек.
        </Text>
        <Button
          colorScheme={isRecording ? 'red' : 'blue'}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? 'Стоп' : 'Начать запись'}
        </Button>
      </Box>
    );
  }

  function renderPreviewStep() {
    return (
      <Box textAlign="center" pb={4}>
        {videoURL && (
          <video
            src={videoURL}
            style={{ width: '100%', borderRadius: '6px' }}
            controls
            autoPlay
          />
        )}
        <Flex mt={4} justify="space-between">
          <Button
            leftIcon={<RepeatIcon />}
            variant="outline"
            onClick={handleReRecord}
          >
            Перезаписать
          </Button>
          <Button colorScheme="green" onClick={startUpload}>
            Загрузить (фейк)
          </Button>
        </Flex>
      </Box>
    );
  }

  function renderUploadStep() {
    return (
      <Box textAlign="center" py={6}>
        <CircularProgress
          value={uploadProgress}
          size="80px"
          color="green.400"
        >
          <CircularProgressLabel>
            {uploadProgress}%
          </CircularProgressLabel>
        </CircularProgress>
        <Text mt={4} fontSize="md">
          Идёт «загрузка» видео. Пожалуйста, не закрывайте приложение.
        </Text>
        <Button variant="ghost" mt={4} size="sm" onClick={cancelUpload}>
          Отменить
        </Button>
      </Box>
    );
  }

  function renderSuccessStep() {
    return (
      <Box textAlign="center" py={6}>
        <Text fontSize="2xl" mb={2} color="green.400">
          ✓
        </Text>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Видео «загружено» успешно!
        </Text>
        <Button colorScheme="green" onClick={onClose}>
          Готово
        </Button>
      </Box>
    );
  }

  function renderContent() {
    switch (step) {
      case 'record':
        return renderRecordStep();
      case 'preview':
        return renderPreviewStep();
      case 'upload':
        return renderUploadStep();
      case 'success':
        return renderSuccessStep();
      default:
        return null;
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetAll();
        onClose();
      }}
      size="md"
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {step === 'record' && 'Запись видео'}
          {step === 'preview' && 'Предпросмотр'}
          {step === 'upload' && 'Загрузка...'}
          {step === 'success' && 'Успех'}
        </ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody>{renderContent()}</ModalBody>
        <ModalFooter justifyContent="flex-end">
          {(step === 'record' || step === 'preview') && (
            <Button
              variant="ghost"
              leftIcon={<CloseIcon fontSize="0.8rem" />}
              onClick={() => {
                resetAll();
                onClose();
              }}
            >
              Закрыть
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
