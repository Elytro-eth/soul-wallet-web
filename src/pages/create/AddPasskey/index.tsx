import { Box, Input } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import FadeId from '@/components/Icons/mobile/FaceId'

export default function AddPasskey({ addingPasskey, onNext, onSkip }: any) {
  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="138px" display="flex" alignItems="flex-start" justifyContent="center" flexDirection="column">
      <Box marginBottom="44px">
        <FadeId />
      </Box>
      <Box
        fontWeight="700"
        fontSize="24px"
        lineHeight="14px"
        marginBottom="32px"
      >
        Add passkey
      </Box>
      <Box width="100%" marginBottom="50px">
        <Box width="100%" fontSize="16px" lineHeight="24px" fontWeight="400" textAlign="left">
          Passkeys will be used to sign in to your account in a safer and more secure way. You can always change your passkeys in Settings later.
        </Box>
      </Box>
      <Button width="100%" disabled={addingPasskey} size="xl" type="blue" onClick={onNext} loading={addingPasskey} minWidth="195px">Add</Button>
    </Box>
  );
}
