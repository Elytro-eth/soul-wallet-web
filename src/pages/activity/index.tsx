import { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Flex, Image, Link } from '@chakra-ui/react';
import Header from '@/components/mobile/Header';
import Button from '@/components/mobile/Button';
import { Link as Rlink } from 'react-router-dom';
import DetailsIMG from '@/components/Icons/mobile/Details';
import TabIcon from '@/components/Icons/mobile/Tab';
import { toFixed, toShortAddress } from '@/lib/tools';
import BN from 'bignumber.js'
import { useNavigate } from 'react-router-dom';
import USDCIcon from '@/assets/mobile/usdc_lg.png';
import ETHIcon from '@/assets/tokens/eth.svg';
import { aaveLink } from '@/config';
import useWallet from '@/hooks/useWallet';
import SettingIcon from '@/components/Icons/mobile/Setting';
import TelegramIcon from '@/components/Icons/mobile/Telegram';
import { headerHeight, tgLink } from '@/config';
import { useAddressStore } from '@/store/address';
import AddressIcon from '@/components/AddressIcon';
import LogoutIcon from '@/components/Icons/mobile/Logout';
import { useHistoryStore } from '@/store/history';
import HistoryIcon from '@/components/Icons/mobile/History';
import ActivityDepositIcon from '@/components/Icons/mobile/Activity/Deposit';
import ActivityTransferIcon from '@/components/Icons/mobile/Activity/Transfer';
import SendIcon from '@/components/Icons/mobile/Send';
import ReceiveIcon from '@/components/Icons/mobile/Receive';
import ActivityEmptyIcon from '@/assets/mobile/activity-empty.svg';

export default function Activity({ isModal, registerScrollable }: any) {
  const { historyList } = useHistoryStore();
  const scrollableRef = useRef<any>();

  useEffect(() => {
    registerScrollable(scrollableRef.current);
  }, []);

  console.log('history', historyList)

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
            {historyList.map((item) => (
              <Box display="flex" alignItems="center" height="52px">
                <Box marginRight="12px">
                  <ReceiveIcon />
                </Box>
                <Box>
                  <Box display="flex" alignItems="center">
                    <Box fontSize="18px" fontWeight="500" lineHeight="22.5px" color="#161F36" textTransform={"capitalize"}>
                      {item.functionName}
                    </Box>
                  </Box>
                  <Box fontSize="12px" fontWeight="400" lineHeight="15px" color="#95979C">{new Date(item.timestamp * 1000).toLocaleString()}</Box>
                </Box>
                <Box marginLeft="auto" display="flex" flexDirection="column" alignItems="flex-end">
                  <Box fontSize="18px" fontWeight="500" lineHeight="22.5px" color="#161F36" display="flex">
                    <Box marginRight="8px">{toFixed(BN(item.actualGasCost).shiftedBy(-18).toString(), 6)} ETH</Box>
                    <Image width="20px" height="20px" src={ETHIcon} />
                  </Box>
                  <Box fontSize="12px" fontWeight="400" lineHeight="15px" color="#95979C" marginTop="4px">{toShortAddress(item.to, 6)}</Box>
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
              <Image src={ActivityEmptyIcon} />
              <Box color="rgba(0, 0, 0, 0.5)" marginTop="18px">
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
  );
}
