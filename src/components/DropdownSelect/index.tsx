import IconChevronRight from '@/assets/icons/chevron-right.svg';
import { ReactNode } from 'react';
import { Image, Flex } from '@chakra-ui/react';

export default function DropdownSelect({ children, hideChevron }: { children: ReactNode; hideChevron?: boolean }) {
  return (
    <Flex
      align={'center'}
      color="#000"
      fontSize={{base: '12px', lg: '14px'}}
      fontWeight={'600'}
      py="2"
      gap="1"
      px="3"
      rounded={'20px'}
      bg="#EFEFEF"
    >
      {children}
      {!hideChevron && <Image src={IconChevronRight} />}
    </Flex>
  );
}
