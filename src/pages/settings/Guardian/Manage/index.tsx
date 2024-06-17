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
import useWalletContext from '@/context/hooks/useWalletContext';
import useScreenSize from '@/hooks/useScreenSize'

export default function Manage({ onPrev, onNext }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [showDetails, setShowDetails] = useState(false)
  const { openModal } = useWalletContext()
  const { innerHeight } = useScreenSize()
  const marginHeight = innerHeight - 468

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
        <Button fontSize="14px" size="xl" type="white" color="black" onClick={() => openModal('addWalletGuardian')}>+Add another guardian</Button>
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
          <Button width="calc(100% - 7px)" disabled={false} size="xl" type="blue" onClick={onOpen}>Continue</Button>
        </Box>
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        blockScrollOnMount={true}
      >
        <ModalOverlay height="100vh" />
        <ModalContent
          borderRadius={{
            sm: '20px 20px 0 0',
            md: '20px',
          }}
          maxW={{
            sm: '100vw',
            md: '430px'
          }}
          marginTop={{
            sm: `${marginHeight}px`,
            md: 'calc(50vh - 125px)'
          }}
          height="468px"
          overflow="auto"
          mb="0"
        >
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <Box
              background="#D9D9D9"
              height="120px"
              width="120px"
              borderRadius="120px"
              marginBottom="30px"
            >

            </Box>
            <Box fontSize="24px" fontWeight="700" marginBottom="14px">
              Confirm guardian update
            </Box>
            <Box
              fontSize="16px"
              textAlign="center"
              marginBottom="10px"
            >
              Please confirm guardian updates on your Soul Wallet account.
            </Box>
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="500"
              fontSize="14px"
              // onClick={() => setShowDetails(!showDetails)}
            >
              <Box>View details</Box>
              <Box marginLeft="2px" transform={showDetails ? 'rotate(-180deg)' : 'rotate(0deg)'}><ChevronDown /></Box>
            </Box>
            {showDetails && (
              <Box
                background="#F8F8F8"
                borderRadius="20px"
                marginTop="12px"
                padding="12px"
                fontWeight="700x"
                fontSize="12px"
              >
                {`{ "domain": { ... } }`}
              </Box>
            )}
            <Box width="100%" marginTop="20px">
              <Button size="xl" type="blue" width="100%">Confirm</Button>
              <Button size="xl" type="white" width="100%" marginTop="20px" onClick={onClose}>Cancel</Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
