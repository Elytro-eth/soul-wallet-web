import { extendTheme, defineStyleConfig } from '@chakra-ui/react';

const inputTheme = defineStyleConfig({
  baseStyle: {
    field: {
      borderRadius: '12px',
      _placeholder: {
        color: '#c1c1c1',
      },
    },
  },
});

const linkTheme = defineStyleConfig({
  baseStyle: {
    _hover: {
      textDecoration: 'none',
    },
    _focusVisible: {
      boxShadow: 'none',
    },
  },
});

const menuTheme = defineStyleConfig({
  baseStyle: {
    list: {
      borderRadius: '16px',
      boxShadow: '0px 4px 20px 0px rgba(0, 0, 0, 0.10)',
      overflow: 'hidden',
    },
    divider: {
      my: 1,
      borderColor: '#E6E6E6',
      mx: 3,
    },
  },
});

const modalTheme = defineStyleConfig({
  baseStyle: {
    dialog: {
      borderRadius: '20px',
      bg: 'brand.white',
    },
  },
});

const tooltipTheme = defineStyleConfig({
  baseStyle: {
    py: '3',
    px: '4',
    fontSize: '12px',
    lineHeight: '16px',
    borderRadius: '12px',
    bg: 'brand.black',
    color: 'brand.white',
  },
});

const theme = extendTheme({
  fonts: {
    body: `'Sohne', 'Inter', 'SF', sans-serif`,
  },
  colors: {
    appBg: 'white',
    danger: '#E83D26',
    brand: {
      red: '#FF2E79',
      redDarken: '#d8507f',
      black: '#000',
      white: '#fff',
      green: '#0CB700',
      greenDarken: '#1b3507',
      gray: '#898989',
      purple: '#6A52EF',
    },
  },
  breakpoints: {
    xs: '280px',
    sm: '320px',
    md: '768px',
    lg: '960px',
    xl: '1200px',
    '2xl': '1536px',
    '3xl': '1920px',
    '4xl': '2560px',
  },
  components: {
    Menu: menuTheme,
    Input: inputTheme,
    Modal: modalTheme,
    Link: linkTheme,
    Tooltip: tooltipTheme,
    Alert: {
      variants: {
        solid: (props: any) => {
          return {
            container: {
              bg: `#1E4124`,
              lineHeight: "24px",
              padding: "24px",
              borderRadius: "24px",
              overflow: 'hidden'
            },
            title: {
              color: "#92EF5A",
              fontSize: "20px",
              fontWeight: '400',
              borderRadius: "24px",
            },
            description: {
              color: "#92EF5A",
              fontSize: "20px",
              fontWeight: '400',
              borderRadius: "24px",
            },
            icon: {
              color: "#92EF5A"
            },
          }
        }
      },
    },
    Switch: {
      baseStyle: {
        thumb: {
          boxShadow:
            '0px 2.612903118133545px 0.8709677457809448px 0px rgba(0, 0, 0, 0.06), 0px 2.612903118133545px 6.967741966247559px 0px rgba(0, 0, 0, 0.15), 0px 0px 0px 0.8709677457809448px rgba(0, 0, 0, 0.04)',
        },
      },
      sizes: {
        lg: {
          track: {
            p: '3px',
          },
        },
      },
    },
  },
});

export default theme;
