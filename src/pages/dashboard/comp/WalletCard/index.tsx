import { Box, Flex, Text, Image, Tooltip } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useState } from 'react';
import useWalletContext from '@/context/hooks/useWalletContext';
import IconSend from '@/assets/icons/wallet/send.svg';
import IconReceive from '@/assets/icons/wallet/receive.svg';
import IconSwap from '@/assets/icons/wallet/swap.svg';
import IconView from '@/assets/icons/wallet/view.svg';
import IconSendActive from '@/assets/icons/wallet/send-active.svg';
import IconReceiveActive from '@/assets/icons/wallet/receive-active.svg';
import IconSwapActive from '@/assets/icons/wallet/swap-active.svg';
import IconViewActive from '@/assets/icons/wallet/view-active.svg';
import useConfig from '@/hooks/useConfig';
import { useAddressStore } from '@/store/address';
import AvatarWithName from '@/components/AvatarWithName';
import useTools from '@/hooks/useTools';
import { useBalanceStore } from '@/store/balance';
import { toFixed } from '@/lib/tools';

export default function WalletCard() {
  const { showSend, showReceive ,showActiveWalletModal} = useWalletContext();
  const [hoverIndex, setHoverIndex] = useState(-1);
  const { selectedAddress } = useAddressStore();
  const { totalUsdValue } = useBalanceStore();
  const { chainConfig, selectedAddressItem } = useConfig();
  const { scanUrl } = chainConfig;

  const actions = [
    {
      title: 'Send',
      icon: IconSend,
      iconActive: IconSendActive,
      isComing: false,
      onClick: () => {
        selectedAddressItem.activated ?  showSend(ethers.ZeroAddress, 'send') : showActiveWalletModal();
      },
    },
    {
      title: 'Receive',
      icon: IconReceive,
      iconActive: IconReceiveActive,
      isComing: false,
      onClick: () => {
        showReceive();
      },
    },
    // {
    //   title: 'Swap',
    //   icon: IconSwap,
    //   iconActive: IconSwapActive,
    //   isComing: true,
    //   onClick: () => {},
    // },
    {
      title: 'View',
      icon: IconView,
      iconActive: IconViewActive,
      isComing: false,
      onClick: () => {
        window.open(`${scanUrl}/address/${selectedAddress}`, '_blank');
      },
    },
  ];

  return (
    <Box
      w={{ base: '400px', '2xl': '460px' }}
      maxW={'95%'}
      zIndex={'20'}
      pt={{base: "20px", lg: "14px"}}
      px="30px"
      pb="20px"
      rounded="20px"
      border="1px solid #EAECF0"
      bg="brand.white"
      boxShadow="0px 4px 30px 0px rgba(0, 0, 0, 0.05)"
    >
      <AvatarWithName editable={true} />
      <Flex align={'center'} mt="24px" mb="20px" gap="2px">
        <Text fontWeight={'700'} fontSize={{ base: '20px', lg: '24px' }} lineHeight={'1'}>
          $
        </Text>
        <Text fontWeight={'800'} fontSize={{ base: '52px', lg: '72px' }} lineHeight={'1'}>
          {toFixed(totalUsdValue, 2)}
        </Text>
      </Flex>
      <Flex gap="6" align={'center'}>
        {actions.map((item, index) => (
          <Tooltip bg="#000" hasArrow key={index} label={item.isComing ? 'Coming soon' : null}>
            <Box
              cursor={'pointer'}
              textAlign={'center'}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(-1)}
              {...(item.isComing
                ? {}
                : {
                    onClick: () => {
                      item.onClick();
                    },
                  })}
            >
              <Image src={hoverIndex === index ? item.iconActive : item.icon} mb="2px" w="8" h="8" mx="auto" />
              <Text fontSize={'12px'} fontWeight={'600'} lineHeight={'1.25'} color="#5b606d">
                {item.title}
              </Text>
            </Box>
          </Tooltip>
        ))}
      </Flex>
    </Box>
  );
}
