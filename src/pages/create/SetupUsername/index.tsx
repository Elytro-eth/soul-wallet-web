import { Box, Input } from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import InputLoading from '@/components/InputLoading';

export default function SepupUsername({ value, onChange, onNext, checking, nameStatus }: any) {
  const disabled = !value || nameStatus !== 0;

  return (
    <Box width="100%" padding="40px 30px" height="400px">
      <Box
        fontWeight="500"
        fontSize="28px"
        lineHeight="30px"
        marginBottom="20px"
      >
        Username
      </Box>
      <Box width="100%" marginBottom="30px">
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          height="56px"
          spellCheck={false}
          fontSize="20px"
          lineHeight="24px"
          fontWeight="400"
          placeholder="Enter or paste here"
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
          ) : (
            <>
              {nameStatus === 0 && (
                <Box
                  fontSize="14px"
                  lineHeight="24px"
                  fontWeight="600"
                  minHeight="24px"
                  color="#0CB700"
                >
                  Coolio, you got a unique name
                </Box>
              )}
              {(nameStatus === 1 || nameStatus === 2) && (
                <Box
                  fontSize="14px"
                  lineHeight="24px"
                  fontWeight="700"
                  minHeight="24px"
                  color="#E83D26"
                >
                  {nameStatus === 1 ? 'Invalid username' : 'This name has been taken. Please try a new one.'}
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
      <Button disabled={disabled} size="xl" type="gradientBlue" width="100%" onClick={onNext}>
        Continue
      </Button>
    </Box>
  );
}
