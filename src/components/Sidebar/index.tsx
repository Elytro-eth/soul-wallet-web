import { Box, Flex, Image, Button, Text, FlexProps, Tooltip } from '@chakra-ui/react';
import { sidebarLinks } from '@/config/constants';
import { Link, useLocation } from 'react-router-dom';
import useWalletContext from '@/context/hooks/useWalletContext';
import IconFeedback from '@/assets/icons/feedback.svg';
import IconFeedbackActive from '@/assets/icons/feedback-active.svg';
import Footer from '../Footer';
import api from '@/lib/api';
import { useSettingStore } from '@/store/setting';
import { useEffect, useState } from 'react';
import useTools from '@/hooks/useTools';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';

const ExtraLink = ({ children, ...restProps }: FlexProps) => {
  return (
    <Flex
      whiteSpace={'nowrap'}
      _hover={{ color: '#7F56D9' }}
      align={'center'}
      pos={'relative'}
      gap={{ base: 1, lg: 2 }}
      cursor={'pointer'}
      {...restProps}
    >
      {children}
    </Flex>
  );
};

export default function Sidebar() {
  const location = useLocation();
  const { setClaimableCount } = useSettingStore();
  const { selectedAddress } = useAddressStore();
  const { selectedChainId } = useChainStore();
  const { showFeedback } = useWalletContext();
  const [navHoverIndex, setNavHoverIndex] = useState(-1);
  const [externalHoverIndex, setExternalHoverIndex] = useState(-1);
  const pathname = location.pathname;

  const checkClaimable = async () => {
    try {
      const res: any = await api.operation.requestTestToken({
        address: selectedAddress,
        chainID: selectedChainId,
        dryRun: true,
      });
      if (res.code === 200) {
        setClaimableCount(res.data.remaining);
      }
    } catch (err) {
      setClaimableCount(0);
    }
  };

  useEffect(() => {
    if (!selectedAddress || !selectedChainId) return;
    checkClaimable();
  }, [selectedAddress, selectedChainId]);

  return (
    <Flex
      bg={{ base: '#fff', lg: 'unset' }}
      gap={{ base: 3, md: 4, lg: 0 }}
      p={{ base: '4', lg: '0' }}
      flexDir={'column'}
      justify={'space-between'}
      m={{ base: 0, lg: 6 }}
      mr="0"
    >
      <Flex flexDir={{ base: 'row', lg: 'column' }} gap={{ base: 2, md: 4, lg: '28px' }} flexWrap={'wrap'}>
        {sidebarLinks.map((link, index) => {
          const isActive = link.href === pathname || pathname.indexOf(link.href) !== -1 || index === navHoverIndex;
          return (
            <Tooltip label={link.isComing ? 'Coming Soon' : null} key={index}>
              <Flex
                onMouseEnter={() => setNavHoverIndex(index)}
                onMouseLeave={() => setNavHoverIndex(-1)}
                {...(link.isComing ? {} : { as: Link, to: link.href, cursor: 'pointer' })}
                gap={{ base: 1, lg: 2 }}
                align={'center'}
              >
                <Image
                  w={{ base: 3, md: 4, lg: 6 }}
                  h={{ base: 3, md: 4, lg: 6 }}
                  src={isActive ? link.iconActive : link.icon}
                />
                <Text
                  fontWeight={'600'}
                  color={isActive ? 'brand.purple' : 'brand.black'}
                  fontSize={{ base: '12px', md: '14px', lg: '16px' }}
                  className="title"
                >
                  {link.title}
                </Text>
              </Flex>
            </Tooltip>
          );
        })}
      </Flex>
      <Flex flexDir={{ base: 'row', lg: 'column' }} gap="8">
        <Flex
          flexDir={{ base: 'row', lg: 'column' }}
          gap={{ base: 2, md: 4, lg: 6 }}
          fontSize={{ base: '12px', md: '14px' }}
          fontWeight={{ base: 600, lg: 400 }}
          color="#383838"
        >
          <ExtraLink
            onMouseEnter={() => setExternalHoverIndex(2)}
            onMouseLeave={() => setExternalHoverIndex(-1)}
            onClick={() => showFeedback()}
          >
            <Image
              h={{ base: 3, md: 4, lg: 6 }}
              w={{ base: 3, md: 4, lg: 6 }}
              src={externalHoverIndex === 2 ? IconFeedbackActive : IconFeedback}
            />
            <Text>Feedback</Text>
          </ExtraLink>
        </Flex>
        <Footer display={{ base: 'none', lg: 'flex' }} />
      </Flex>
    </Flex>
  );
}
