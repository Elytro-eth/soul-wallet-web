import { Box, Input } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import FadeId from '@/components/Icons/mobile/FaceId'
import useScreenSize from '@/hooks/useScreenSize'

export default function AddPasskey({ addingPasskey, onNext}: any) {
  const { innerHeight } = useScreenSize()

  return (
    <Box width="100%" padding="30px" height={innerHeight - 64} display="flex" alignItems="flex-start" justifyContent="center" flexDirection="column">
      <Box
        fontWeight="700"
        fontSize="24px"
        lineHeight="30px"
        marginBottom="8px"
        textAlign="center"
        width="100%"
      >
        Add passkey
      </Box>
      <Box
        marginBottom="40px"
        textAlign="center"
        width="100%"
      >
        <Box width="100%" fontSize="14px" lineHeight="18px" fontWeight="400" textAlign="center" color="#676B75">
          Passkeys will be used to sign in to your account in a safer and more secure way. You can always change your passkeys in Settings later.
        </Box>
      </Box>
      <Button width="100%" loading={addingPasskey} disabled={addingPasskey} size="xl" type="gradientBlue" onClick={onNext} minWidth="195px">Add</Button>
    </Box>
  );
}
