import { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Flex, Image, Link } from '@chakra-ui/react';
import Header from '@/components/mobile/Header';
import Button from '@/components/mobile/Button';
import { Link as Rlink } from 'react-router-dom';
import DetailsIMG from '@/components/Icons/mobile/Details';
import TabIcon from '@/components/Icons/mobile/Tab';
import { formatDate, getIconMapping, toFixed, toShortAddress } from '@/lib/tools';
import BN from 'bignumber.js';
import { useNavigate } from 'react-router-dom';
import USDCIcon from '@/assets/mobile/usdc_lg.png';
import ETHIcon from '@/assets/tokens/eth.svg';
import { aaveLink } from '@/config';
import useWallet from '@/hooks/useWallet';
import { headerHeight, tgLink } from '@/config';
import { useAddressStore } from '@/store/address';
import { useHistoryStore } from '@/store/history';
import ActivityDepositIcon from '@/components/Icons/mobile/Activity/Deposit';
import ActivityTransferIcon from '@/components/Icons/mobile/Activity/Transfer';
import OpenIcon from '@/components/Icons/desktop/Open';
import ActivityEmptyIcon from '@/assets/mobile/activity-empty.png';
import TokenIcon from '@/components/TokenIcon';

const getSubject = (functionName: any) => {
  if (functionName === 'Send') {
    return "To:"
  } else if (functionName === 'Receive') {
    return "From:"
  } else {
    return "On:"
  }
}

const shouldShowAmount = (functionName: any) => {
  if (functionName === 'Send') {
    return true
  } else if (functionName === 'Receive') {
    return true
  } else {
    return false
  }
}

export default function Activity({ isModal, isDashboard }: any) {
  const { historyList } = useHistoryStore();

  console.log('history', historyList);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
      position="relative"
      marginTop={isDashboard ? '0' : '24px'}
      height={isDashboard ? 'calc(100vh - 104px)' : (window.innerHeight - 20)}
      background="white"
    >
      <Box
        width={{
          sm: '100%',
          md: isDashboard ? '100%' : '798px',
        }}
      >
        <Box
          fontSize="32px"
          fontWeight="500"
          lineHeight="24px"
          width="100%"
          paddingLeft="30px"
          paddingRight="30px"
          marginTop={isDashboard ? '32px' : '60px'}
        >
          Activity
        </Box>
        <Box
          width="100%"
          background="white"
          marginTop="27px"
          overflow="auto"
          paddingLeft="30px"
          paddingRight="30px"
          height={isDashboard ? 'calc(100vh - 170px)' : (window.innerHeight - 60)}
        >
          {historyList.length ? (
            <Flex gap="16px" padding="0" flexDir="column" width="100%" paddingBottom="16px">
              {historyList.map((item, index) => (
                <Box
                  display="flex"
                  alignItems="center"
                  height={{
                    sm: '52px',
                    // md: '42px',
                  }}
                  key={index}
                  width="100%"
                >
                  <Image w="8" h="8" mr="10px" flex={"0 0 32px"} src={getIconMapping(item.functionName)} />
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    width="calc(100% - 42px)"
                    flexDirection={{
                      sm: 'column',
                      md: 'row',
                    }}
                    justifyContent={{
                      sm: 'center',
                      md: 'space-between',
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <Box fontSize="18px" fontWeight="500" lineHeight="22.5px" color="#161F36">
                        {item.functionName}
                      </Box>
                      {(shouldShowAmount(item.functionName)) && (
                        <Box fontSize="18px" fontWeight="500" lineHeight="22.5px" color="#161F36" marginLeft="4px">
                          <Box>
                            {item.tokenChanged}
                          </Box>
                          {item.toInfo && <Image ml="1" width="20px" height="20px" src={item.toInfo.logoURI} />}
                        </Box>
                      )}
                    </Box>
                    <Box fontSize="12px" fontWeight="400" lineHeight="15px" color="#95979C" marginTop="2px" display="flex" alignItems="center">
                      {getSubject(item.functionName)}{toShortAddress(item.interactAddress, 6)}
                      <Box
                        marginLeft="8px"
                        cursor="pointer"
                        display={{
                          sm: 'none',
                          md: 'block'
                        }}
                      >
                        <OpenIcon />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Flex>
          ) : (
            <Flex
              gap="16px"
              padding="0"
              width="100%"
              paddingBottom="16px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Box width="100%" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                <Image src={ActivityEmptyIcon} w={'216px'} h="108px" />
                <Box color="#676B75" marginTop="8px">
                  You don’t have any activity yet
                </Box>
              </Box>
            </Flex>
          )}
        </Box>
        {/* {finalHistoryList && finalHistoryList.length > 0 && (
            <Box
            width="100%"
            background="white"
            marginTop="27px"
            overflow="auto"
            ref={scrollableRef}
            paddingLeft="30px"
            paddingRight="30px"
            >
            <Flex
            gap="36px"
            padding="0"
            flexDir="column"
            width="100%"
            overflow="auto"
            // maxHeight="calc(100% - 120px)"
            >
            {finalHistoryList.map((item: any, i: any) => (
            <Box
            key={i}
            display="flex"
            alignItems="center"
            height="40px"
            >
            <Box marginRight="12px">
            {item.action === 'Deposit' ? <ActivityDepositIcon /> :  <ActivityTransferIcon />}
            </Box>
            <Box>
            <Box
            display="flex"
            alignItems="center"
            >
            <Box fontSize="14px" fontWeight="500">{item.action}</Box>
            </Box>
            <Box fontSize="12px">{item.dateFormatted}</Box>
            </Box>
            <Box marginLeft="auto">
            <Box fontSize="14px" fontWeight="500">{item.amountFormatted} USDC</Box>
            </Box>
            </Box>
            ))}
            </Flex>
            </Box>
            )} */}
      </Box>
    </Box>
  );
}
