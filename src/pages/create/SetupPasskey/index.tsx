import { Box, Input } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import FadeId from '@/components/Icons/mobile/FaceId'

export default function SepupPasskey({ addingPasskey, onNext, onSkip }: any) {
  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="117px" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
      <Box marginBottom="74px">
        <FadeId />
      </Box>
      <Box
        fontWeight="700"
        fontSize="24px"
        lineHeight="14px"
        marginBottom="14px"
      >
        Setup passkey
      </Box>
      <Box width="100%" marginBottom="50px">
        <Box fontSize="16px" lineHeight="24px" fontWeight="400" textAlign="center">
          Passkeys will be used to sign in to your account in a safer and more secure way. You can always change your passkeys in Settings later.
        </Box>
      </Box>
      <Button disabled={!!addingPasskey} size="xl" type="black" onClick={onNext} minWidth="195px">Continue</Button>
    </Box>
  );
}
