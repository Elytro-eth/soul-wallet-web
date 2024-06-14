import { useState } from 'react'
import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link, Image, Menu, MenuList, MenuItem } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import EmailIcon from '@/assets/mobile/email-guardian.svg'
import GuardianIcon from '@/assets/mobile/guardian.svg'
import EmailGuardianIcon from '@/components/Icons/mobile/EmailGuardian';
import WalletGuardianIcon from '@/components/Icons/mobile/WalletGuardian';
import ChevronDown from '@/components/Icons/mobile/ChevronDown';
import EditIcon from '@/components/Icons/mobile/Edit';
import AddressIcon from '@/components/AddressIcon';

export default function Manage({ onPrev, onNext }: any) {
  return (
    <Box width="100%" height="100%" padding="30px" display="flex" flexDirection="column">
      <Box fontSize="16px" fontWeight="600">My guardians</Box>
      <Box marginTop="14px">
        <Box
          border="1px solid #DFDFDF"
          borderRadius="12px"
          padding="22px 24px"
          display="flex"
          alignItems="center"
          marginBottom="16px"
        >
          <Box width="48px" height="48px" marginRight="8px">
            <AddressIcon address={`necklaceeez@gmail.com`} width={48} />
          </Box>
          <Box>
            <Box fontSize="16px" fontWeight="600">Email guardian</Box>
            <Box fontSize="12px" fontWeight="500" marginTop="4px" color="#868686">necklaceeez@gmail.com</Box>
          </Box>
          <Box marginLeft="auto">
            <EditIcon />
          </Box>
        </Box>
        <Box
          border="1px solid #DFDFDF"
          borderRadius="12px"
          padding="22px 24px"
          display="flex"
          alignItems="center"
          marginBottom="16px"
        >
          <Box width="48px" height="48px" marginRight="8px">
            <AddressIcon address={`necklaceeez@gmail.com`} width={48} />
          </Box>
          <Box>
            <Box fontSize="16px" fontWeight="600">Guardian1</Box>
            <Box fontSize="12px" fontWeight="500" marginTop="4px" color="#868686">{`0xAAAa……6dS123`}</Box>
          </Box>
          <Box marginLeft="auto">
            <EditIcon />
          </Box>
        </Box>
      </Box>
      <Box marginBottom="40px">
        <Button fontSize="14px" size="xl" type="white" color="black">+Add another guardian</Button>
      </Box>
      <Box width="100%" height="1px" background="#F0F0F0" marginBottom="40px" />
      <Box fontSize="16px" fontWeight="600">Recovery settings</Box>
      <Box marginBottom="14px" marginTop="12px">
        <Button borderRadius="8px" width="100%" size="xl" type="white" color="black">1</Button>
      </Box>
      <Box marginBottom="20px">
        out of 2 guardian(s) confirmation is needed for wallet recovery.
      </Box>
      <Box
        marginTop="auto"
        width="100%"
        display="flex"
        marginBottom="10px"
      >
        <Box width="50%" paddingRight="7px">
          <Button width="calc(100% - 7px)" disabled={false} size="xl" type="white" onClick={onPrev} color="black">Back</Button>
        </Box>
        <Box width="50%" paddingLeft="7px">
          <Button width="calc(100% - 7px)" disabled={false} size="xl" type="blue" onClick={onNext}>Continue</Button>
        </Box>
      </Box>
    </Box>
  );
}
