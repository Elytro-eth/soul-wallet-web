import { Box, Input, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import FadeId from '@/components/Icons/mobile/FaceId'
import PasskeyIcon from '@/assets/add-passkey.png'
import useScreenSize from '@/hooks/useScreenSize'

export default function AddPasskey({ addingPasskey, onNext}: any) {
  const { innerHeight } = useScreenSize()

  return (
    <Box width="100%" padding="30px" height={innerHeight - 64} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
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
        Setup passkey
      </Box>
      <Box
        marginBottom="40px"
        textAlign="center"
        width="100%"
      >
        <Box width="100%" fontSize="14px" lineHeight="17.5px" fontWeight="400" textAlign="center" color="#676B75">
        Setup with your fingerprint, Face, or Lock ID.<br/><br/>
        Use passkey to sent transaction in a safer and more secure way. You can change it later.
        </Box>
      </Box>
      <Button width="100%" loading={addingPasskey} disabled={addingPasskey} size="xl" type="gradientBlue" onClick={onNext} minWidth="195px">
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box marginRight="8px"><FadeId /></Box>
          <Box>Setup</Box>
        </Box>
      </Button>
      <Box height="100px" />
    </Box>
  );
}
