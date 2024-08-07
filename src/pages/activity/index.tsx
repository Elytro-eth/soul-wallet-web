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

export default function Activity({ isModal, registerScrollable }: any) {
  const { historyList } = useHistoryStore();
  const scrollableRef = useRef<any>();

  useEffect(() => {
    registerScrollable(scrollableRef.current);
  }, []);

  console.log('history', historyList);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
      marginTop="24px"
      position="relative"
      height={window.innerHeight - 20}
    >
      <Box
        width={{
          sm: '100%',
          md: '798px',
        }}
      >
        <Box
          // fontSize="18px"
          fontSize="32px"
          fontWeight="500"
          lineHeight="24px"
          width="100%"
          paddingLeft="30px"
          paddingRight="30px"
          marginTop="60px"
        >
          Activity
        </Box>
        <Box
          width="100%"
          background="white"
          marginTop="27px"
          overflow="auto"
          ref={scrollableRef}
          paddingLeft="30px"
          paddingRight="30px"
          height={window.innerHeight - 64}
        >
          {historyList.length ? (
            <Flex gap="16px" padding="0" flexDir="column" width="100%" paddingBottom="16px">
              {historyList.map((item, index) => (
                <Box display="flex" alignItems="center" height="52px" key={index}>
                  <Image w="8" h="8" mr="3" flex={"0 0 32px"} src={getIconMapping(item.functionName)} />
                  <Box>
                    <Box display="flex" alignItems="center">
                      <Box fontSize="18px" fontWeight="500" lineHeight="22.5px" color="#161F36">
                        {toShortAddress(item.interactAddress, 6)}
                      </Box>
                    </Box>
                    <Box fontSize="12px" fontWeight="400" lineHeight="15px" color="#95979C" marginTop="2px">
                      {formatDate(new Date(item.timestamp * 1000))}
                    </Box>
                  </Box>
                  <Box marginLeft="auto" display="flex" flexDirection="column" alignItems="flex-end">
                    <Box
                      fontSize="14px"
                      fontWeight="500"
                      lineHeight="17.5px"
                      color="#161F36"
                      textTransform={'capitalize'}
                    >
                      {item.functionName}
                    </Box>
                    <Flex
                      align={'center'}
                      fontSize="18px"
                      fontWeight="500"
                      lineHeight="22.5px"
                      color="#161F36"
                      display="flex"
                      marginTop="2px"
                    >
                      <Box>
                        {item.sendEthAmount ? item.sendEthAmount : item.sendErc20Amount ? item.sendErc20Amount : 0}
                        {/* {toFixed(BN(item.actualGasCost).shiftedBy(-18).toString(), 6)} ETH */}
                      </Box>
                      {item.toInfo && <Image ml="1" width="20px" height="20px" src={item.toInfo.logoURI} />}
                      {/*  */}
                    </Flex>
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
