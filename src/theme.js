// theme.js
import { extendTheme } from '@chakra-ui/react';

// Пример базовой темы с коралловым "primary"
const customTheme = extendTheme({
  colors: {
    primary: {
      50: '#FFEDEB',
      100: '#FFCFCB',
      200: '#FFB1AB',
      300: '#FF938B',
      400: '#FF756B',
      500: '#FF6E6B', // основной акцентный цвет
      600: '#CC5856',
      700: '#994241',
      800: '#662C2C',
      900: '#331616',
    },
    // Вторичные и акцентные тона
    secondary: {
      50: '#ECFBFA',
      100: '#C4F3F0',
      200: '#9AEAE5',
      300: '#70E1DB',
      400: '#46D8D0',
      500: '#2EC4B6', // мягкий бирюзовый, как пример вторичного
      600: '#26A699',
      700: '#1E8074',
      800: '#15594F',
      900: '#0D332A',
    },
    // Дополнительные цвета по желанию (желтый, лаванда и т.д.)
    gold: {
      500: '#FFD45E',
    },
    lavender: {
      500: '#B18AE0',
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  // Глобальные стили закруглений, теней и т.д.
  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
  },
  shadows: {
    outline: '0 0 0 3px rgba(255,110,107,0.3)', // эффект при фокусе
  },
});

export default customTheme;
