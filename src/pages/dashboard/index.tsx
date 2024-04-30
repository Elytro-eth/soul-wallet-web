import { Box, Flex  } from '@chakra-ui/react';
import Tokens from './comp/Tokens';
import Activity from './comp/Activity';
import WalletCard from './comp/WalletCard';
import Guidance from './comp/Guidance';
import useConfig from '@/hooks/useConfig';

export default function Dashboard() {
  const {selectedAddressItem} = useConfig();

  return (
    <Flex
      gap={{ base: 6, lg: '50px' }}
      h={{ lg: '100%' }}
      flexDir={{ base: 'column', lg: 'row' }}
      justify={{ base: 'center', lg: 'unset' }}
      alignItems="center"
    >
      <Flex w={{ base: '100%', lg: '40%' }} h={{ lg: '100%' }} flexDir={'column'} justify={'center'} align={'center'}>
        <WalletCard />
        {(selectedAddressItem && !selectedAddressItem.activated) && <Guidance />}
        <Activity />
      </Flex>
      <Flex
        flexDir={'column'}
        w={{ base: '95%', lg: '60%' }}
        mx="auto"
        rounded={{ base: '20px', lg: 'unset' }}
        h={{ lg: '100%' }}
        gap={{base: 8, lg: 0}}
        bg="brand.white"
        py={{ base: '20px', lg: '30px' }}
        px={{ base: '24px', lg: '64px' }}
        mb={{ base: '64px', lg: 'unset' }}
        pb={{ base: '20px', lg: '30px' }}
        borderLeft={'1px solid #EAECF0'}
      >
        <Tokens />
      </Flex>
    </Flex>
  );
}
