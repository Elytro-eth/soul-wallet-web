import { useState, useEffect } from 'react';
import IconCopy from '@/assets/copy.svg';
import useTools from '@/hooks/useTools';
import { Flex, Text, Box, useToast, Image, BoxProps, Checkbox } from '@chakra-ui/react';
import { useChainStore } from '@/store/chain';
import useConfig from '@/hooks/useConfig';
import { useSettingStore } from '@/store/setting';
import { useAddressStore } from '@/store/address';
import { useBalanceStore } from '@/store/balance';
import { ZeroAddress } from 'ethers';
import BN from 'bignumber.js';
import Button from '../Button';

interface IReceiveCode extends BoxProps {
  address: string;
  showFullAddress?: boolean;
  imgWidth?: string;
}

const DepositHint2 = () => {
  const [active, setActive] = useState<any>(false)
  const { getAddressDisplay, saveAddressDisplay } = useSettingStore();
  const { selectedAddress } = useAddressStore();

  return (
    <Flex
      align={'center'}
      justify={'center'}
      backdropFilter={'blur(12px)'}
      pos="absolute"
      pt={{ base: '40px', xl: '80px', '2xl': '100px' }}
      pb="100px"
      top="0"
      right={'0'}
      zIndex={'1'}
      left={0}
      // bottom={0}
    >
      <Box>
        <Text mb="47px" fontSize={'16px'} fontWeight="600" lineHeight={1.5} textAlign={'center'}>

        </Text>
        <Checkbox
          defaultChecked={active}
          marginBottom="18px"
          onChange={(e) => setActive(!!e.target.checked)}
        >
          <Text fontWeight="500" fontSize="16px">
            I acknowledge the network is Ethereum, not any other chain
          </Text>
        </Checkbox>
        <Flex gap="2" flexDir={'column'} align={'center'}>
          <Button py="13px" disabled={!active} onClick={() => saveAddressDisplay(selectedAddress, true)}>
            Show wallet address
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default function ReceiveCode({ address, showFullAddress, imgWidth = '90px', ...restProps }: IReceiveCode) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const { chainConfig } = useConfig();
  const { generateQrCode, doCopy } = useTools();
  const { getAddressDisplay } = useSettingStore();
  const { selectedAddress } = useAddressStore();
  const { getTokenBalance } = useBalanceStore();
  const userDeposited = BN(getTokenBalance(ZeroAddress).tokenBalance).isGreaterThan(0);
  // const addressWithPrefix = `${chainConfig.addressPrefix}${address}`
  const generateQR = async (text: string) => {
    try {
      setImgSrc(await generateQrCode(text));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!address) {
      return;
    }
    generateQR(address);
  }, [address]);

  return (
    <Box position="relative" paddingTop="15px">
      {(!getAddressDisplay(selectedAddress) && !userDeposited) && <DepositHint2 />}
      <Box textAlign={'center'} fontSize={'12px'} {...restProps}>
        <Image src={imgSrc} mx="auto" display={'block'} w={148} mb="2" />
        <Flex fontSize={{base: '12px', lg: '14px'}} mb="2" justify={'center'} flexDir={{base: 'column', md: 'row'}}>
          <Text fontWeight={'700'}>{chainConfig.addressPrefix}</Text>
          <Text fontWeight={'500'}>
            {address}
          </Text>
        </Flex>
        <Button type="white" py="10px" px="15px" border="1px solid #e0e0e0" display={'block'} mx="auto" onClick={() => doCopy(address)} mb="14px">
          Copy address
        </Button>
        <Flex flexDir={{base: 'column', md: 'row'}} display="inline-flex" align={'center'} py={{base: 2, lg: 1}} px="3" rounded={'12px'} bg="rgba(98, 126, 234, 0.10)">
          <Image src={chainConfig.icon} w="5" mr="1" />
          <Text fontWeight={'800'}>{chainConfig.chainName} network - &nbsp;</Text>
          <Text fontWeight={'600'}>Only send {chainConfig.chainName} assets to this address</Text>
        </Flex>
      </Box>
    </Box>
  );
}
