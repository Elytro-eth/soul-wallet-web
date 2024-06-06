import { useState, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import SendForm from './SendForm';
import FadeSwitch from '@/components/FadeSwitch';

export default function Send({ isModal }: any) {
  return (
    <Box width="100%" height="100%">
      <FadeSwitch key={0}>
        <SendForm isModal={true} />
      </FadeSwitch>
    </Box>
  )
}
