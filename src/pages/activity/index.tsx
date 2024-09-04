import { Box } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import ActivityList from './ActivityList';


export default function Activity() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
      height="100%"
      position="relative"
      background="white"
    >
      <Box
        width='100%'
      >
        <Box
          fontSize="32px"
          fontWeight="500"
          color="#161F36"
          padding="22px 32px"
          display='flex'
          alignItems="center"
          justifyContent="span-between"
          width="100%"
        >
          Activity
        </Box>
        <Box
          width="100%"
          marginTop="27px"
          overflow="auto"
          paddingLeft="30px"
          paddingRight="30px"
        >
          <ActivityList />
        </Box>
      </Box>
    </Box>
  );
}
