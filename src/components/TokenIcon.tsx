import { useChainStore } from '@/store/chain';
import { Image } from '@chakra-ui/react';

export default function TokenIcon({ address, size }: { address: string, size: number }) {
  const { selectedChainId } = useChainStore();
  return (
    <Image
      src={`https://static.metafi.codefi.network/api/v1/tokenIcons/${parseInt(selectedChainId)}/${address.toLowerCase()}.png`}
      width={`${size}px`}
      height={`${size}px`}
      onError={(e) => {
        
      }}
    />
  );
}
