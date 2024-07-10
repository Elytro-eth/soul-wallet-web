import React from 'react';
import { Button as CButton, ButtonProps, Image } from '@chakra-ui/react';
import IconLoading from '@/assets/loading.svg';
import useConfig from '@/hooks/useConfig';
import { useSlotStore } from '@/store/slot';

const getSizeStyles = (size?: string) => {
  const baseStyles = {};

  if (!size) {
    return baseStyles;
  }

  if (size === 'xl') {
    return {
      height: '63px',
      borderRadius: '63px',
      fontSize: '18px',
      lineHeight: '22.5px',
      fontWeight: '500',
      ...baseStyles,
    };
  } else if (size === 'lg') {
    return {
      height: '40px',
      borderRadius: '40px',
      fontSize: '16px',
      fontWeight: '500',
      ...baseStyles,
    };
  } else if (size === 'mid') {
    return {
      height: '36px',
      borderRadius: '36px',
      fontSize: '14px',
      fontWeight: '500',
      ...baseStyles,
    };
  } else if (size === 'sm') {
    return {
      height: '24px',
      borderRadius: '24px',
      fontSize: '12px',
      fontWeight: '500',
      ...baseStyles,
    };
  } else if (size === 'xs') {
    return {
      height: '18px',
      borderRadius: '18px',
      fontSize: '12px',
      ...baseStyles,
    };
  }
};

const buttonStyles = {
  black: {
    color: '#fff',
    bg: '#000',
    _hover: { bg: '#4E4E53' },
    _disabled: { cursor: 'not-allowed', bg: '#B2B2B2', _hover: { bg: '#B2B2B2' } },
  },
  white: {
    color: '#161F36',
    bg: 'white',
    border: '1px solid #BDC0C7',
    _hover: { bg: 'white' },
    _disabled: { cursor: 'not-allowed', color: '#B2B2B2', _hover: { bg: "#fff" } },
  },
  grey: {
    color: '#000',
    bg: '#f2f2f2',
    _hover: { bg: '#e8e8e8' },
    _disabled: { cursor: 'not-allowed', bg: '#B2B2B2', _hover: { bg: '#B2B2B2' } },
  },
  purple: {
    color: 'brand.purple',
    bg: 'rgba(225, 220, 252, 0.80)',
    _hover: { bg: 'rgba(225, 220, 252, 1)' },
    _disabled: {
      cursor: 'not-allowed',
    },
  },
  blue: {
    color: 'white',
    bg: '#3042B9',
    _hover: { bg: '#3042B9' },
    _disabled: {
      cursor: 'not-allowed',
      opacity: '0.6'
    },
  },
  red: {
    color: '#E8424C',
    bg: '#FCE9EA',
    _hover: { bg: '#FCE9EA' },
    _disabled: {
      cursor: 'not-allowed',
      opacity: '0.6'
    },
  },
  gradientBlue: {
    color: '#161F36',
    background: 'radial-gradient(100% 336.18% at 0% 0%, #FFFAF5 4.96%, #F7F1F0 25.15%, #C8DCF3 100%)',
    _hover: {
      background: 'radial-gradient(100% 336.18% at 0% 0%, #FFFAF5 4.96%, #F7F1F0 25.15%, #C8DCF3 100%)',
    },
    _disabled: {
      cursor: 'not-allowed',
      opacity: '0.4'
    },
  },
  transparent: {
    color: '#161F36',
    bg: 'transparent',
    _hover: { bg: 'transparent' },
    border: '1px solid #BDC0C7',
    _disabled: {
      cursor: 'not-allowed',
      opacity: '0.4'
    },
  },
  lightBlue: {
    color: 'white',
    bg: '#DCE4F2',
    _hover: { bg: '#DCE4F2' },
    _disabled: {
      cursor: 'not-allowed',
      opacity: '0.4'
    },
  },
  text: {
    color: '#497EE6',
    bg: 'transparent',
    _hover: { bg: 'transparent' },
    _disabled: {
      cursor: 'not-allowed',
      opacity: '0.4'
    },
  },
};

interface IProps extends Omit<ButtonProps, 'type'> {
  children: React.ReactNode;
  onClick?: () => void;
  type?: keyof typeof buttonStyles;
  loading?: boolean;
  disabled?: boolean;
  skipSignCheck?: boolean;
  href?: string;
  size?: string;
}

export default function Button({
  onClick,
  type,
  children,
  loading,
  disabled,
  href,
  skipSignCheck,
  size,
  ...restProps
}: IProps) {
  const { selectedAddressItem } = useConfig();
  const { slotInfo } = useSlotStore();
  const styles = buttonStyles[type || 'black'];

  const canSign = selectedAddressItem || skipSignCheck || !slotInfo.slot;

  const sizeStyles = getSizeStyles(size);

  const doClick = () => {
    if (!loading && !disabled && canSign && onClick) {
      onClick();
    }
  };

  const moreProps: any = {};

  if (!disabled) {
    moreProps.href = href;
  }

  return (
    <CButton
      h="unset"
      transition={'all 0.2s ease-in-out'}
      onClick={() => (canSign ? doClick() : null)}
      rounded={'30px'}
      lineHeight={'1'}
      isDisabled={disabled || !canSign}
      gap="2"
      {...styles}
      {...sizeStyles}
      {...moreProps}
      {...restProps}
    >
      {loading ? <Image src={IconLoading} w="24px" h="24px" /> : children}
    </CButton>
  );
}
