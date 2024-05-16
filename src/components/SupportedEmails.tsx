import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { validEmailDomains, validEmailProviders } from '@/config/constants';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SupportedEmails() {
  const [hovered, setHovered] = useState(false);
  return (
    <Box pos="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Text fontWeight={'600'} color="#005BE4">
        Supported email
      </Text>
      <Flex
        as={motion.div}
        transition={"all .3s"}
        animate={{
          opacity: hovered ? '1' : 0,
        }}
        flexDir={'column'}
        w="138px"
        gap="18px"
        pos="absolute"
        top="24px"
        boxShadow={'0px 4px 20px 0px rgba(0, 0, 0, 0.15)'}
        left="0"
        p="18px"
        bg="#fff"
        rounded={'8px'}
      >
        {validEmailProviders.map((provider, index) => (
          <Flex gap="2" align={'center'} key={index}>
            <Image src={provider.icon} w="6" />
            <Text fontSize={'14px'} fontWeight={'600'}>
              {provider.title}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );

  //     <Menu>
  //     <MenuButton>
  //       <Text color="#005be4" textDecoration={'underline'}>
  //         Supported email
  //       </Text>
  //     </MenuButton>
  //     <MenuList w="138px">
  //       {validEmailProviders.map((provider, index) => (
  //         <MenuItem gap="2" key={index}>
  //           <Image src={provider.icon} w="6" />
  //           <Text fontSize={'14px'} fontWeight={'600'}>
  //             {provider.title}
  //           </Text>
  //         </MenuItem>
  //       ))}
  //     </MenuList>
  //   </Menu>
}
