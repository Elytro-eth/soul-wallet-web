import { Box, Input } from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import NameChecked from '@/components/Icons/mobile/NameChecked';
import InputLoading from '@/components/InputLoading';

export default function SetUsername({ checking, username, isWalletNotFound, setUsername, accountInfo, onNext }: any) {
  const disabled = !username;

  return (
    <Box width="100%" padding="40px 30px" height="400px">
      <Box
        fontWeight="500"
        fontSize="28px"
        lineHeight="1"
        marginBottom="20px"
        color="#161F36"
      >
        Enter username
      </Box>
      <Box width="100%" marginBottom="30px">
        <Input
          value={username}
          onChange={(e) => { setUsername(e.target.value); }}
          height="82px"
          spellCheck={false}
          fontSize="32px"
          autoFocus
          lineHeight="34px"
          fontWeight="500"
          placeholder="Enter username or wallet address"
          border="none"
          outline="none"
          background="#F2F3F5"
          padding="24px 29px"
          borderRadius="24px"
          color="#161F36"
          marginBottom="8px"
          _focusVisible={{ border: 'none', boxShadow: 'none' }}
        />
        <Box mt="1" minH="44px">
          {checking && (
            <InputLoading />
          )}
          {(!checking && username) && (
            <>
              {(accountInfo) ? (
                <Box width="100%" background="#1E4124" borderRadius="12px" padding="12px">
                  <Box color="#92EF5A" fontSize="18px" fontWeight="500" display="flex" alignItems="center">
                    <Box marginRight="8px">
                      <NameChecked />
                    </Box>
                    <Box>Wallet found</Box>
                  </Box>
                  <Box fontSize="18px" fontWeight="400">
                    <Box as="span" color="rgba(255, 255, 255, 0.9)">
                      {accountInfo.address.slice(0,6)}
                    </Box>
                    <Box as="span" color="rgba(255, 255, 255, 0.4)">
                      {accountInfo.address.slice(6, -6)}
                    </Box>
                    <Box as="span" color="rgba(255, 255, 255, 0.9)">
                      {accountInfo.address.slice(-6)}
                    </Box>
                  </Box>
                </Box>
              ) : isWalletNotFound ? (
                <Box width="100%" background="#612024" borderRadius="16px" padding="16px">
                  <Box fontSize="18px" fontWeight="400">
                    <Box as="span" color="#E8424C">
                      Wallet not found, please enter valid Soul Wallet address
                    </Box>
                  </Box>
                </Box>
              ) : <></>}
            </>
          )}
        </Box>
      </Box>
      <Button disabled={!accountInfo||disabled} size="xl" type="gradientBlue" width="100%" onClick={onNext}>
        Continue
      </Button>
    </Box>
  );
}
