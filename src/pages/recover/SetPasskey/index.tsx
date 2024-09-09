import { Box, Input, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import FadeId from '@/components/Icons/mobile/FaceId'
import PasskeyIcon from '@/assets/add-passkey.png'
import useScreenSize from '@/hooks/useScreenSize'

export default function SetPasskey({ onNext, addingPasskey }: any) {
  const { innerHeight } = useScreenSize()

  return (
    <Box
      width="100%"
      padding="30px"
      height={{
        base: innerHeight - 64,
        lg: 'auto',
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box
        marginBottom="24px"
        width="144px"
        height="144px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          width="105px"
          height="105px"
          src={PasskeyIcon}
        />
      </Box>
      <Box
        fontWeight="500"
        fontSize="28px"
        marginBottom="8px"
        textAlign="center"
        width="100%"
        color="#161F36"
        lineHeight="1"
      >
        Add passkey
      </Box>
      <Box
        marginBottom="40px"
        textAlign="center"
        width="100%"
      >
        <Box width="100%" fontSize="14px" lineHeight="17.5px" fontWeight="400" textAlign="center" color="#676B75">
          Passkeys will be used to sign in to your account in a safer and more secure way. You can always change your passkeys in Settings later.
        </Box>
      </Box>
      <Button width="100%" size="xl" type="gradientBlue" onClick={onNext} minWidth="195px" loading={addingPasskey}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box marginRight="8px"><FadeId /></Box>
          <Box>Add</Box>
        </Box>
      </Button>
      <Box height="80px" width="1" />
    </Box>
  );
}
