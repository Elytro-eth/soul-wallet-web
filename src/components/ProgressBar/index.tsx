import { Box } from '@chakra-ui/react';

export default function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <Box
      width="100%"
      height="1.5px"
    >
      <Box width={`${percentage}%`} height="100%" background="black" transition="all 0.2s ease" />
    </Box>
  );
}
