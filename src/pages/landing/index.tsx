import { Box, Image, Flex } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/mobile/Header'
import Button from '@/components/mobile/Button'
import IntroItem1Icon from '@/components/Icons/mobile/Intro/Item1'
import IntroItem2Icon from '@/components/Icons/mobile/Intro/Item2'
import IntroItem3Icon from '@/components/Icons/mobile/Intro/Item3'
import USDCIcon from '@/assets/tokens/usdc.png'
import config from '@/config';
import useWallet from '@/hooks/useWallet';
import { useBalanceStore } from '@/store/balance';
import treasuryIcon from '@/assets/mobile/treasury.png'
import CoinbaseIcon from '@/assets/mobile/coinbase.png'
import AAVEIcon from '@/assets/mobile/aave.png'
import BN from 'bignumber.js'

export default function Landing() {
  const { loginWallet  } = useWallet();
  const { sevenDayApy } = useBalanceStore();
  const navigate = useNavigate();
  const doSignIn = async () => {
    await loginWallet();
    navigate('/dashboard');
  }

  const baseHeight = 59;
  const aaveHeight = BN(sevenDayApy).div(5).times(baseHeight).toNumber();

  return (
    <Box
      width="100%"
      height="100%"
      fontFamily={"SF"}
      // background="linear-gradient(180deg, #FBFBFB 0%, #F0F0F0 100%)"
    >
      <Header
        showLogo
        title=""
        height="60px"
        background="transparent"
      />
      <Box width="100%" padding="30px" display="flex" alignItems="center" flexDirection="column">
        <Box  fontSize="48px" fontWeight="700" textAlign="center" lineHeight="56px">
          Save for<br /> Every Human
        </Box>
        <Box  fontSize="16px" fontWeight="500" textAlign="center" marginTop="14px">
          Security first. Completely controlled by yourself and your trusted networks
        </Box>
        <Link to="/create">
          <Button size="xl" type="black" minWidth="283px" marginTop="50px">Create free account</Button>
        </Link>
        <Button
          size="xl"
          type="text"
          minWidth="283px"
          marginTop="10px"
          color="black"
          marginBottom="20px"
          onClick={doSignIn}
        >
          Sign in
        </Button>
        <Box
          width="100%"
          background="white"
          borderRadius="24px"
          boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
          border="1px solid #EAECF0"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            padding="50px 10px"
            paddingBottom="6px"
          >
            <Box display="flex" alignItems="center">
              <Box>
                <Image src={USDCIcon} />
              </Box>
              <Box marginLeft="10px">
                <Box
                  
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
                    OP Mainnet
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" marginTop="16px">
              <Box
                
                fontSize="72px"
                fontWeight="700"
              >
                {sevenDayApy}
              </Box>
              <Box
                
                fontSize="24px"
                fontWeight="700"
                marginTop="24px"
                marginLeft="10px"
              >
                %
              </Box>
            </Box>
            <Box  fontSize="18px" fontWeight="600">
              7D Average APY
            </Box>
          </Box>
          <Box display="flex">
            <Box
              width="33.33%"
              display="flex"
              alignItems="flex-end"
              justifyContent="center"
            >
              <Box
                width="40px"
                height={`${baseHeight}px`}
                borderRadius="12px 12px 0 0"
                background="linear-gradient(180deg, rgba(73, 126, 230, 0.60) 0%, rgba(73, 126, 230, 0.10) 100%)"
                display="flex"
                alignItems="flex-start"
                paddingTop="6px"
                justifyContent="center"
              >
                <Image width="28px" height="28px" src={CoinbaseIcon} className="icon" />
              </Box>
            </Box>
            <Box
              width="33.33%"
              display="flex"
              alignItems="flex-end"
              justifyContent="center"
            >
              <Box
                width="40px"
                height={`${baseHeight}px`}
                borderRadius="12px 12px 0 0"
                background="linear-gradient(180deg, rgba(252, 209, 22, 0.60) 0%, rgba(252, 209, 22, 0.10) 100%)"
                display="flex"
                alignItems="flex-start"
                paddingTop="6px"
                justifyContent="center"
              >
                <Image width="28px" height="28px" src={treasuryIcon} className="icon" />
              </Box>
            </Box>
            <Box
              width="33.33%"
              display="flex"
              alignItems="flex-end"
              justifyContent="center"
            >
              <Box
                width="40px"
                height={`${aaveHeight}px`}
                borderRadius="12px 12px 0 0"
                background="linear-gradient(180deg, rgba(70, 167, 191, 0.60) 0%, rgba(176, 84, 160, 0.10) 100%)"
                display="flex"
                alignItems="flex-start"
                paddingTop="6px"
                justifyContent="center"
              >
                <Image width="28px" height="28px" src={AAVEIcon} className="icon" />
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            borderTop="1px solid rgba(0, 0, 0, 0.1)"
          >
            <Box
              width="33.33%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="18px 10px"
            >
              <Box
                
                fontWeight="600"
                fontSize="14px"
                textAlign="center"
              >
                5.01% APY
              </Box>
              <Box
                
                fontWeight="600"
                fontSize="12px"
                color="rgba(0, 0, 0, 0.5)"
                marginTop="5px"
                textAlign="center"
              >
                Coinbase
              </Box>
            </Box>
            <Box
              width="33.33%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="18px 10px"
            >
              <Box
                
                fontWeight="600"
                fontSize="14px"
                textAlign="center"
              >
                5.03% APY
              </Box>
              <Box
                
                fontWeight="600"
                fontSize="12px"
                color="rgba(0, 0, 0, 0.5)"
                marginTop="5px"
                textAlign="center"
              >
                U.S. Treasury bill
              </Box>
            </Box>
            <Box
              width="33.33%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="18px 10px"
            >
              <Box
                
                fontWeight="600"
                fontSize="14px"
                textAlign="center"
              >
                {sevenDayApy}% APY
              </Box>
              <Box
                
                fontWeight="600"
                fontSize="12px"
                color="rgba(0, 0, 0, 0.5)"
                marginTop="5px"
                textAlign="center"
              >
                USDC on AAVE
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="flex-end" marginTop="42px" marginBottom="20px">
          <Box
            fontSize="24px"
            fontWeight="700"
          >
            Onchain
          </Box>
          <Box
            fontSize="18px"
            fontWeight="400"
            padding="4px 10px"
          >
            vs
          </Box>
          <Box
            fontSize="24px"
            fontWeight="700"
          >
            CEX
          </Box>
        </Box>
        <Box
          width="100%"
          background="white"
          borderRadius="24px"
          boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
          border="1px solid #EAECF0"
        >
          <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box width="30px" height="30px" display="flex" alignItems="center" justifyContent="center" marginRight="10px">
              <IntroItem1Icon />
            </Box>
            <Box>
              <Box fontSize="18px" fontWeight="700">
                Higher APY rate
              </Box>
              <Box fontSize="14px" fontWeight="400">
                For USDC, onchain earn has a upto {sevenDayApy}% APY, which is higher than most CEX.
              </Box>
            </Box>
          </Box>

          <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box width="30px" height="30px" display="flex" alignItems="center" justifyContent="center" marginRight="10px">
              <IntroItem2Icon />
            </Box>
            <Box>
              <Box fontSize="18px" fontWeight="700">
                Your key, your return
              </Box>
              <Box fontSize="14px" fontWeight="400">
                Self custody wallet with fully decentralized service.
              </Box>
            </Box>
          </Box>

          <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box width="30px" height="30px" display="flex" alignItems="center" justifyContent="center" marginRight="10px">
              <IntroItem3Icon />
            </Box>
            <Box>
              <Box fontSize="18px" fontWeight="700">
                Simple and free
              </Box>
              <Box fontSize="14px" fontWeight="400">
                Instant deposit and redeem. No management fees.
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="flex-end" marginTop="42px" marginBottom="20px">
          <Box
            fontSize="24px"
            fontWeight="700"
          >
            How Stable.cash earns
          </Box>
        </Box>
        <Box
          width="100%"
          background="white"
          borderRadius="24px"
          boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
          border="1px solid #EAECF0"
        >
          <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box>
              <Box fontSize="18px" fontWeight="700">
                Earn supply interest on AAVE
              </Box>
              <Box fontSize="14px" fontWeight="400">
                Each asset has its own market of supply and demand with its own APY (Annual Percentage Yield) which evolves with time. You can find the average annual rate over the past 30 days to evaluate the rate evolution, and you can also find more data on the reserve overview of each asset in the home section on the app.
              </Box>
            </Box>
          </Box>

          <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box>
              <Box fontSize="18px" fontWeight="700">
                Earn the most with Auto-saving
              </Box>
              <Box fontSize="14px" fontWeight="400">
                Stable.cash empowers each account for a customized risk free feature, auto-saving. Each deposit to the Stable.cash account will be auto saved into AAVE protocol to earn interest. You can withdraw anytime with a flexible term for your assets. Let auto-saving makes the most of your earnings.
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="flex-end" marginTop="42px" marginBottom="20px">
          <Box
            fontSize="24px"
            fontWeight="700"
          >
            About OP Mainnet
          </Box>
        </Box>

        <Box
          width="100%"
          background="white"
          borderRadius="24px"
          boxShadow="0px 8px 60px 0px rgba(44, 53, 131, 0.12)"
          border="1px solid #EAECF0"
        >
          <Box display="flex" padding="24px" borderBottom="1px solid rgba(0, 0, 0, 0.1)">
            <Box width="100%">
              <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                marginBottom="14px"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    
                    fontWeight="700"
                    fontSize="18px"
                    textAlign="center"
                  >
                    $8.317b
                  </Box>
                  <Box
                    
                    fontWeight="400"
                    fontSize="12px"
                    marginTop="5px"
                    textAlign="center"
                  >
                    TVL
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    
                    fontWeight="700"
                    fontSize="18px"
                    textAlign="center"
                  >
                    2th
                  </Box>
                  <Box
                    
                    fontWeight="400"
                    fontSize="12px"
                    marginTop="5px"
                    textAlign="center"
                  >
                    Ranking
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    
                    fontWeight="700"
                    fontSize="18px"
                    textAlign="center"
                  >
                    21.28%
                  </Box>
                  <Box
                    
                    fontWeight="400"
                    fontSize="12px"
                    marginTop="5px"
                    textAlign="center"
                  >
                    L2 Market share
                  </Box>
                </Box>
              </Box>
              <Box fontSize="14px" fontWeight="400">
                OP Mainnet is an EVM-equivalent Optimistic Rollup. It aims to be fast, simple, and secure.
              </Box>
            </Box>
          </Box>
        </Box>
        <Box marginTop="40px" textAlign="center">
          <Box color="#7a787e">Version: Alpha 0.0.1</Box>
          <Flex gap="4" justify="center" align="center" mt="10px">
            {config.socials.map((item, idx) => (
              <a
                href={item.link}
                target="_blank"
                key={idx}
              >
                <Image w="6" h="6" src={item.icon} className="icon" />
                <Image w="6" h="6" src={item.iconActivated} display="none" className="icon-activated" />
              </a>
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
