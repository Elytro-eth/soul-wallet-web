import { Box } from '@chakra-ui/react';

export default function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <Box
      width="100%"
      height="4px"
    >
      <Box width={`${percentage}%`} height="100%" background="#324174" transition="all 0.2s ease" opacity="0.1" />
    </Box>
  );
}
