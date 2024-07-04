import { Box } from '@chakra-ui/react';

export default function ProgressBar({ activeIndex, size }: any) {
  console.log('size', size, Array(size))
  return (
    <Box
      width="100%"
      height="1.5px"
      display="flex"
      padding="0 24px"
    >
      {Array(size).fill(0).map((item: any, i: number) => {
        return (
          <Box
            key={i}
            height="100%"
            width={`calc((100% - 24px - ${(size - 1) * 8}px) / 3)`}
            background={(i <= activeIndex) ? 'black' : 'rgba(0, 0, 0, 0.2)'}
            transition="all 0.2s ease"
            marginRight="8px"
            marginLeft="8px"
          />
        )
      })}
    </Box>
  );
}
