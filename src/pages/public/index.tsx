import Header from '@/components/mobile/Header'
import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

export default function Public() {
  const innerHeight = window.innerHeight

  return (
    <Box
      width="100%"
      height={innerHeight}
      // todo, adapt pc later
      // maxWidth="430px"
    >
      <Header
        showLogo={true}
        title=""
        height="60px"
        background="transparent"
      />
      <Box
        width="100%"
        height="calc(100% - 60px)"
      >
        <Outlet />
      </Box>
    </Box>
  );
}
