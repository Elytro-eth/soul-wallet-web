import ListItem from '@/components/ListItem';
import { Image, Link, Flex, Text, Box } from '@chakra-ui/react';
import { Link as RLink } from 'react-router-dom';
import { toFixed, toShortAddress } from '@/lib/tools';
import BN from 'bignumber.js';
import { getIconMapping } from '@/lib/tools';
import IconEth from '@/assets/chains/eth.svg';

export enum ActivityStatusEn {
  Success,
  Error,
  Pending,
}

export interface IActivityItem {
  functionName: string;
  txHash: string;
  status: ActivityStatusEn;
  amount?: string;
  to?: string;
}

export default function ActivityItem({ item, scanUrl }: any) {
  if (!item.functionName) {
    return <></>;
  }

  return (
    <Link
      display={'flex'}
      as={RLink}
      justifyContent={'space-between'}
      alignItems={'center'}
      to="/activity"
    >
      <Flex gap="3" align={'center'}>
        <Image src={getIconMapping(item.functionName)} w="32px" h="32px" />
        <Box>
          <Flex align={'flex-start'} justify="center" fontSize="12px" color="#5B606D" maxW={'90%'} flexDir="column">
            <Text fontSize={'14px'} fontWeight={'800'} textTransform={'capitalize'} whiteSpace={"nowrap"}>
              {(item.functionName === 'setGuardian') ? 'Update Guardian' : item.functionName}
            </Text>
            {!!item.to && (
              <Box fontSize="12px" whiteSpace="pre">To: {toShortAddress(item.to)}</Box>
            )}
          </Flex>
        </Box>
      </Flex>
      {(item.functionName !== 'Create Wallet') && (
        <Flex gap="2">
          <Text fontSize={'16px'} textAlign={'right'} fontWeight={'700'}>
            {item.actualGasCost ? `${toFixed(BN(item.actualGasCost).shiftedBy(-18).toString(), 6)} ETH` : ''}
          </Text>
          <Image src={IconEth} />
        </Flex>
      )}
      {(item.functionName === 'Create Wallet') && (
        <Flex gap="2">
          <Flex flexDir="column" align="flex-end">
            <Flex fontSize={'16px'} fontWeight={'700'}>Free</Flex>
            <Flex>
              <Text fontSize={'12px'} textAlign={'right'} color="#5B606D" textDecoration="line-through">
                {item.actualGasCost ? `${toFixed(BN(item.actualGasCost).shiftedBy(-18).toString(), 6)} ETH` : ''}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Link>
  );
}
