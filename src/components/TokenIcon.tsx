import { useChainStore } from '@/store/chain';
import IconDefault from '@/assets/tokens/default.svg';
import IconEth from '@/assets/tokens/eth.svg';
import { Image } from '@chakra-ui/react';
import { ZeroAddress } from 'ethers';

export default function TokenIcon({ address, size }: { address: string; size: number }) {
  const { selectedChainId } = useChainStore();

  const isEth = address === ZeroAddress;

  return (
    <Image
      src={
        isEth
          ? IconEth
          : `https://static.metafi.codefi.network/api/v1/tokenIcons/${parseInt(selectedChainId)}/${address.toLowerCase()}.png`
      }
      fallbackSrc={IconDefault}
      width={`${size}px`}
      height={`${size}px`}
    />
  );
}
