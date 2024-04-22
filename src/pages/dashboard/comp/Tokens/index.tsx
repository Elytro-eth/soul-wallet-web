import React, { useState } from 'react';
import { ExternalLink } from '../HomeCard';
import ListItem from '@/components/ListItem';
import { Text, Box, Flex, Checkbox } from '@chakra-ui/react';
import { ITokenBalanceItem, useBalanceStore } from '@/store/balance';
import HomeCard from '../HomeCard';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useSlotStore } from '@/store/slot';
import Button from '@/components/Button';
import { Link } from 'react-router-dom';
import ReceiveCode from '@/components/ReceiveCode';
import { useAddressStore } from '@/store/address';
import { toFixed } from '@/lib/tools';
import { useSettingStore } from '@/store/setting';
import { ZeroAddress } from 'ethers';
import BN from 'bignumber.js';

const SetGuardianHint = ({ onShowSkip }: { onShowSkip: () => void }) => {
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
      zIndex={'10'}
      left={0}
      // bottom={0}
    >
      <Box>
        <Text mb="18px" fontSize={'16px'} lineHeight={1.5} textAlign={'center'}>
          Setup guardians to finish your wallet creation
          <br /> for{' '}
          <Text as="span" fontWeight={'700'}>
            $0 gas fee
          </Text>
          . Effective immediately!
        </Text>
        <Flex gap="2" flexDir={'column'} align={'center'}>
          <Link to="/security/guardian">
            <Button py="13px" w="152px">
              Setup guardians
            </Button>
          </Link>

          <Button
            py="13px"
            w="152px"
            color="brand.black"
            bg="brand.white"
            _hover={{ bg: '#eee' }}
            border="1px solid #D0D5DD"
            // loading={creating}
            onClick={onShowSkip}
          >
            Later
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

const DepositHint = () => {
  const { selectedAddress } = useAddressStore();
  return (
    <Box>
      <Text fontWeight={'600'} lineHeight={1.5} textAlign={'center'} mb="4">
        You don't have any tokens in your wallet yet,
        <br /> deposit tokens into the following address to experience Soul wallet.
      </Text>
      <ReceiveCode address={selectedAddress} imgWidth="100px" showFullAddress={true} mb="6" />
    </Box>
  );
};

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
      zIndex={'10'}
      left={0}
      // bottom={0}
    >
      <Box>
        <Text mb="107px" fontSize={'16px'} fontWeight="600" lineHeight={1.5} textAlign={'center'}>
          You are not holding any token yet.<br />Get your first deposit with your wallet address
        </Text>
        <Checkbox
          defaultChecked={active}
          marginBottom="18px"
          onChange={(e) => setActive(!!e.target.checked)}
        >
          <Text fontWeight="500">
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

const lineColors = [
  '#5B92FF',
  '#AF81F2',
  '#FF9458',
  '#FFAAB4',
  '#FE5A95',
  '#AF56D9',
  '#00C4A0',
  '#FFA800',
  '#8AB11B',
  '#6328E5',
];

const TokenBalanceTable = ({ tokenBalance, showSendAssets }: any) => {
  const { totalUsdValue } = useBalanceStore();
  return (
    <Flex gap="6" flexDir={'column'}>
      {tokenBalance.map((item: ITokenBalanceItem, idx: number) => (
        <React.Fragment key={idx}>
          <ListItem
            key={idx}
            idx={idx}
            icon={item.logoURI}
            tokenPrice={toFixed(item.tokenPrice, 2)}
            usdValue={item.usdValue}
            totalUsdValue={totalUsdValue}
            title={item.name || 'Unknown'}
            lineColor={lineColors[idx] || 'brand.gray'}
            amount={toFixed(item.tokenBalanceFormatted, 6) }
            onClick={() => showSendAssets(item.contractAddress)}
          />
        </React.Fragment>
      ))}
    </Flex>
  );
};

export default function Tokens() {
  const { showSend } = useWalletContext();
  const { tokenBalance } = useBalanceStore();
  const { getAddressDisplay } = useSettingStore();
  const { selectedAddress } = useAddressStore();
  const { getTokenBalance } = useBalanceStore();
  const userDeposited = BN(getTokenBalance(ZeroAddress).tokenBalance).isGreaterThan(0);

  const showSendAssets = (tokenAddress: string) => {
    showSend(tokenAddress);
  };

  const isTokenBalanceEmpty = tokenBalance.every((item) => !Number(item.tokenBalance));

  console.log('selectedAddress', selectedAddress, !!getAddressDisplay(selectedAddress))
  return (
    <HomeCard
      title={'Assets'}
      pos="relative"
      external={<ExternalLink title="View more" to="/asset" />}
      h="100%"
    >

      {(!getAddressDisplay(selectedAddress) && !userDeposited) && <DepositHint2 />}
      {isTokenBalanceEmpty ? (
        <DepositHint />
      ) : (
        <TokenBalanceTable tokenBalance={tokenBalance} showSendAssets={showSendAssets} />
      )}
    </HomeCard>
  );
}
