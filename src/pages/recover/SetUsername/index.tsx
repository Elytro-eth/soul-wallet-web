import { Box, Input } from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import NameChecked from '@/components/Icons/mobile/NameChecked';
import InputLoading from '@/components/InputLoading';

export default function SetUsername({ username, setUsername, accountInfo, onNext }: any) {
  const disabled = !username;

  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="138px">
      <Box fontWeight="700" fontSize="24px" lineHeight="14px" marginBottom="20px">
        Set up username
      </Box>
      <Box width="100%" marginBottom="72px">
        <Input
          value={username}
          spellCheck={false}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          fontSize="32px"
          lineHeight="24px"
          padding="0"
          fontWeight="700"
          placeholder="Enter username or wallet address"
          borderRadius="0"
          border="none"
          outline="none"
          _focusVisible={{ border: 'none', boxShadow: 'none' }}
        />
        <Box marginTop="10px" width="100%" height="1px" background="rgba(73, 126, 130, 0)" />
        {username && (
          <>
            {accountInfo ? (
              <Box width="100%" background="#F5FFF4" borderRadius="12px" padding="12px">
                <Box color="#0CB700" fontSize="12px" fontWeight="600" display="flex" alignItems="center">
                  <Box marginRight="4px">
                    <NameChecked />
                  </Box>
                  <Box>Wallet found</Box>
                </Box>
                <Box fontSize="13px" fontWeight="600">
                  <Box as="span" color="black">
                    {accountInfo.address.slice(0,6)}
                  </Box>
                  <Box as="span" color="rgba(0, 0, 0, 0.4)">
                    {accountInfo.address.slice(6, -6)}
                    
                  </Box>
                  <Box as="span" color="black">
                    {accountInfo.address.slice(-6)}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box width="100%" background="#FFF9F8" borderRadius="12px" padding="12px" marginTop="10px">
                <Box fontSize="12px" fontWeight="600">
                  <Box as="span" color="#E83D26">
                    Wallet not found, please enter valid Soul Wallet address
                  </Box>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
      <Button disabled={false} size="xl" type="blue" width="100%" onClick={onNext}>
        Continue
      </Button>
    </Box>
  );
}
