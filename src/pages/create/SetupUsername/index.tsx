import { Box, Input } from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import InputLoading from '@/components/InputLoading';

export default function SepupUsername({ value, onChange, onNext, checking, nameStatus }: any) {
  const valueIsNotString = typeof value !== 'string';
  const lengthNotMatch = value.length < 3 || value.length > 24;
  const valueHasSpecialChar = /[^a-zA-Z0-9_]/.test(value);

  const disabled = !value || nameStatus !== 0 || valueIsNotString || lengthNotMatch || valueHasSpecialChar;

  return (
    <Box width="100%" padding="40px 30px" height="400px">
      <Box
        fontWeight="500"
        fontSize="28px"
        lineHeight="1"
        marginBottom="20px"
        color="#161F36"
      >
        Username
      </Box>
      <Box width="100%" marginBottom="12px">
        <Input
          value={value}
          autoFocus
          onChange={(e) => onChange(e.target.value)}
          height="56px"
          spellCheck={false}
          fontSize="20px"
          lineHeight="24px"
          fontWeight="400"
          placeholder="Enter username"
          border="none"
          outline="none"
          background="#F2F3F5"
          padding="16px"
          borderRadius="16px"
          color="#161F36"
          marginBottom="16px"
          _focusVisible={{ border: 'none', boxShadow: 'none' }}
        />
        <Box mt="1" h="44px" overflow={'hidden'}>
          {checking ? (
            <InputLoading />
          ) : nameStatus === 0 ? (
            <Box fontSize="14px" lineHeight="17.5" color="#0CB700">
              Coolio, you got a unique name
            </Box>
          ) : nameStatus === 1 ? (
            <Box fontSize="14px" lineHeight="17.5" color="#E8424C">
              {valueIsNotString && 'Please enter a valid name'}
              {lengthNotMatch && 'Name must be between 3 and 24 characters'}
              {valueHasSpecialChar && 'Name must contain only letters, numbers, and underscores'}
            </Box>
          ) : nameStatus === 2 ? (
            <Box fontSize="14px" lineHeight="17.5" color="#E8424C">
              This name has been taken. Please try a new one.
            </Box>
          ) : (
            ''
          )}
        </Box>
      </Box>
      <Button disabled={disabled} size="xl" type="gradientBlue" width="100%" onClick={onNext}>
        Continue
      </Button>
    </Box>
  );
}
