import { Box } from '@chakra-ui/react';

export default function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <Box
      width="100%"
      height="2px"
    >
      <Box width={`${percentage}%`} height="100%" background="#6B8AFF" />
    </Box>
  );
}
