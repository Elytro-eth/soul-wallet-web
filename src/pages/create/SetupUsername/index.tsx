import { Box, Input } from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import InputLoading from '@/components/InputLoading';

export default function SepupUsername({ value, onChange, onNext, checking, nameStatus }: any) {
  const disabled = !value || nameStatus !== 0;

  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="138px">
      <Box fontWeight="700" fontSize="24px" lineHeight="14px" marginBottom="20px">
        Set up username
      </Box>
      <Box width="100%" marginBottom="72px">
        <Input
          value={value}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
          fontSize="32px"
          lineHeight="24px"
          padding="0"
          fontWeight="700"
          placeholder="Enter or paste here"
          borderRadius="0"
          border="none"
          outline="none"
          _focusVisible={{ border: 'none', boxShadow: 'none' }}
        />
        <Box marginTop="10px" width="100%" height="1px" background="rgba(73, 126, 130, 0.2)" />
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
                  marginTop="8px"
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
                  marginTop="8px"
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
      <Button disabled={disabled} size="xl" type="black" width="100%" onClick={onNext}>
        Continue
      </Button>
    </Box>
  );
}
