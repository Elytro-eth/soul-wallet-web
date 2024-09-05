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
      overflow='hidden'
    >
      <Box
        width='100%'
        height="100%"
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
          height='90px'
        >
          Activity
        </Box>
        <Box
          width="100%"
          overflow="auto"
          paddingLeft="30px"
          paddingRight="30px"
          height='calc(100% - 90px)'
        >
          <ActivityList /><ActivityList />
        </Box>
      </Box>
    </Box>
  );
}
