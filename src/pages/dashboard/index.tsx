import React, { useState, useCallback, useEffect } from 'react';
import { Box, Image, Flex, Link } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import Button from '@/components/mobile/Button'
import CheckIcon from '@/components/Icons/mobile/Check'
import WithdrawIcon from '@/components/Icons/mobile/Withdraw'
import MoreIcon from '@/components/Icons/mobile/More'
import USDCIcon from '@/assets/tokens/usdc.png'
import config from '@/config';
import api from '@/lib/api';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import { useBalanceStore } from '@/store/balance';

export default function Dashboard() {
  const [hasBalance, setHasBalance] = useState(true)
  const { selectedAddress } = useAddressStore();
  const { selectedChainId } = useChainStore();
  const { totalUsdValue, tokenBalance, getTokenBalance } = useBalanceStore();
  const [apy, setApy] = useState(0);

  const getApy = async () => {
    const res = await api.aave.apy({
      reserveId: '0x833589fcd6edb6e08f4c7c32d4f71b54bda029130xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D8453',
      // from: Math.floor((Date.now() - 1000 * 60 * 60 * 24 * 7)/ 1000),
      resolutionInHours: 6,
    })

    const latest7Days = res.data.slice(326);

    const totalApy = latest7Days.reduce((acc: number, cur: any) => {
      return acc + cur.liquidityRate_avg;
    } , 0);

    const avgApy = totalApy / latest7Days.length;
    setApy(avgApy)
  }

  const pendingUsdcBalance = getTokenBalance(import.meta.env.VITE_TOKEN_USDC)

  useEffect(()=>{
    getApy();
  }, [])

  if (hasBalance) {
    return (
      <Box padding="30px">
        <Box>
          <Box fontSize="18px" fontWeight="700" lineHeight="24px" marginBottom="14px">My Balance</Box>
          <Box
            width="100%"
            background="white"
            borderRadius="24px"
            boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
            border="1px solid #EAECF0"
          >
            <Box
              borderBottom="1px solid rgba(0, 0, 0, 0.1)"
              display="flex"
              flexDirection="column"
              alignItems="center"
              padding="50px 10px"
            >
              <Box display="flex" alignItems="center" marginTop="16px">
                <Box
                  fontFamily="Nunito"
                  fontSize="72px"
                  fontWeight="800"
                >
                  {totalUsdValue.split('.')[0]}
                </Box>
                {Number(totalUsdValue) > 0 && <Box
                  fontFamily="Nunito"
                  fontSize="24px"
                  fontWeight="800"
                  marginTop="24px"
                  marginLeft="10px"
                  color="#939393"
                >
                  .{totalUsdValue.split('.')[1]}
                </Box> }
              </Box>
              {
                pendingUsdcBalance > 0 && <Box color="rgba(0, 0, 0, 0.60)" fontSize="14px">
                  Deposit in progress, est complete in <Box color="#497EE6" as="span">1 min</Box>
                </Box>
              }
            
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-around">
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                padding="30px 10px"
                width="34%"
              >
                <Box width="100%">
                  <Button width="100%" size="xl" type="lightBlue" minWidth="100px" boxShadow="none">
                    <WithdrawIcon />
                  </Button>
                </Box>
                <Box
                  fontFamily="Nunito"
                  fontWeight="600"
                  fontSize="14px"
                  color="black"
                  marginTop="8px"
                  textAlign="center"
                >
                  Withdraw
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                padding="30px 10px"
                width="calc(66% - 20px)"
              >
                <Box width="100%">
                  <Button width="100%" size="xl" type="blue">
                    $
                  </Button>
                </Box>
                <Box
                  fontFamily="Nunito"
                  fontWeight="600"
                  fontSize="14px"
                  color="black"
                  marginTop="8px"
                >
                  Deposit USDC
                </Box>
              </Box>
            </Box>
          </Box>
          <Box width="100%" marginTop="24px">
            <Box fontSize="18px" fontWeight="700" marginBottom="12px">Earn from</Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <Box marginRight="8px">
                  <Image src={USDCIcon} />
                </Box>
                <Box>
                  <Box fontSize="18px" fontWeight="700">USDC on AAVE</Box>
                  <Box fontSize="14px" fontWeight="400">Arbitrum network</Box>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <Box fontSize="18px" fontWeight="700">{(apy * 100).toFixed(2)}%</Box>
                  <Box fontSize="14px" fontWeight="400" textAlign="right">7day average APY</Box>
                </Box>
                <Box marginLeft="10px">
                  <MoreIcon />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      width="100%"
      height="100%"
      background="linear-gradient(180deg, #F5F6FA 0%, #EEF2FB 100%)"
    >
      <Box width="100%" padding="30px" display="flex" alignItems="center" flexDirection="column">
        <Box fontFamily="Nunito" fontSize="36px" fontWeight="700" textAlign="center" lineHeight="56px">
          Deposit, save and earn
        </Box>
        <Box fontFamily="Nunito" fontSize="14px" fontWeight="500" textAlign="center" marginTop="14px">
          Deposit to your Soul Wallet account, get <Box fontWeight="700">auto-saved</Box> into the best interest rate pool and start earning today!
        </Box>
        <Button size="xl" type="blue" minWidth="283px" marginTop="50px">Deposit USDC</Button>
        <Button
          size="xl"
          type="text"
          minWidth="283px"
          marginTop="10px"
          color="black"
          marginBottom="20px"
        >
          What’s auto-saving
        </Button>
        <Box
          width="100%"
          background="white"
          borderRadius="24px"
          boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
          border="1px solid #EAECF0"
        >
          <Box
            borderBottom="1px solid rgba(0, 0, 0, 0.1)"
            display="flex"
            flexDirection="column"
            alignItems="center"
            padding="50px 10px"
          >
            <Box display="flex" alignItems="center">
              <Box>
                <Image src={USDCIcon} />
              </Box>
              <Box marginLeft="10px">
                <Box
                  fontFamily="Nunito"
                  fontSize="24px"
                  fontWeight="700"
                  lineHeight="30px"
                >
                  Earn USDC
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                >
                  <Box
                    fontFamily="Nunito"
                    fontSize="14px"
                    fontWeight="700"
                    lineHeight="18px"
                  >
                    on AAVE |
                  </Box>
                  <Box
                    fontSize="14px"
                    fontWeight="400"
                    marginLeft="4px"
                    lineHeight="18px"
                  >
                    Arbitrum
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" marginTop="16px">
              <Box
                fontFamily="Nunito"
                fontSize="72px"
                fontWeight="800"
              >
                12.16
              </Box>
              <Box
                fontFamily="Nunito"
                fontSize="24px"
                fontWeight="800"
                marginTop="24px"
                marginLeft="10px"
              >
                %
              </Box>
            </Box>
            <Box fontFamily="Nunito" fontSize="18px" fontWeight="600">
              7D Average APY
            </Box>
          </Box>
          <Box display="flex">
            <Box
              width="50%"
              borderRight="1px solid rgba(0, 0, 0, 0.1)"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="30px 10px"
            >
              <Box
                fontFamily="Nunito"
                fontWeight="600"
                fontSize="18px"
                textAlign="center"
              >
                Max 10% APY
              </Box>
              <Box
                fontFamily="Nunito"
                fontWeight="600"
                fontSize="14px"
                color="rgba(0, 0, 0, 0.5)"
                marginTop="8px"
                textAlign="center"
              >
                On Exchange
              </Box>
            </Box>
            <Box
              width="50%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="30px 10px"
            >
              <Box
                fontFamily="Nunito"
                fontWeight="600"
                fontSize="18px"
              >
                Max 5.01% APY
              </Box>
              <Box
                fontFamily="Nunito"
                fontWeight="600"
                fontSize="14px"
                color="rgba(0, 0, 0, 0.5)"
                marginTop="8px"
              >
                On U.S. Treasury
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
