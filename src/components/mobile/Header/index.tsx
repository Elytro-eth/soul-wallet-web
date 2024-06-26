import { Box, Text, Image,} from '@chakra-ui/react';
import BackIcon from '@/components/Icons/mobile/Back'
import ImgLogo from '@/assets/soul-logo.svg';

export default function Header({ title, onBack, step, showBackButton, showLogo, ...props }: any) {
  return (
    <Box
      height="60px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      background="white"
      position="relative"
      {...props}
    >
      {showLogo && (
        <Box
          position="absolute"
          left="20px"
          top="calc(50% - 17px)"
          cursor="pointer"
        >
          <Image src={ImgLogo} />
        </Box>
      )}
      {showBackButton && (
        <Box
          position="absolute"
          left="20px"
          top="0px"
          cursor="pointer"
          marginTop="15px"
          onClick={onBack}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <BackIcon />
        </Box>
      )}
      <Box fontSize="20px" fontWeight="500" color="black" lineHeight="24px">
        {title}
      </Box>
    </Box>
  );
}
