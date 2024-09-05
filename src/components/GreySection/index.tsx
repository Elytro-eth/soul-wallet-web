import { Box } from '@chakra-ui/react';

export default function GreySection({ leftPart, rightPart, ...props }: any) {
  return (
    <Box
      width="100%"
      bg="#EDEDED"
      borderRadius="20px"
      padding="45px"
      display="flex"
      alignItems="flex-start"
      justifyContent="space-around"
      margin="0 auto"
      flexDirection={{ base: 'column', lg: 'row' }}
      {...props}
    >
      <Box
        width={{ base: '100%', lg: '40%' }}
        paddingRight={{ base: '0', lg: '30px' }}
      >
        {leftPart}
      </Box>
      <Box
        width={{ base: '100%', lg: '60%' }}
        marginTop={{ base: '10px', lg: '0' }}
      >
        {rightPart}
      </Box>
    </Box>
  );
}
