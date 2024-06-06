import { useEffect, useRef, useState, useCallback, Fragment } from 'react'
import { Box, Input, Image, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure, Link } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import Header from '@/components/mobile/Header'
import QuestionIcon from '@/components/Icons/Question'
import SendingIcon from '@/components/Icons/mobile/Sending'
import SentIcon from '@/components/Icons/mobile/Sent'
import { useBalanceStore } from '@/store/balance';
import BN from 'bignumber.js'
import OpIcon from '@/assets/mobile/op.png'
import USDCIcon from '@/assets/mobile/usdc.png'
import { toFixed } from '@/lib/tools';
import { isAddress } from 'ethers';

export default function Review({ isModal, onPrev }: any) {
  const [withdrawAmount, setWithdrawAmount] = useState<any>('');
  const [sendTo, setSendTo] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const innerHeight = window.innerHeight
  const marginHeight = innerHeight - 468

  return (
    <Box width="100%" height={innerHeight} overflowY="scroll">
      <Header
        title=""
        showBackButton={!isModal}
        onBack={onPrev}
      />
      <Box padding="30px" minHeight={isModal ? 'calc(100vh - 118px)' : 'calc(100vh - 62px)'}>
        {(isSent) && (
          <Box fontSize="32px" fontWeight="700" display="flex" alignItems="center">
            <Box marginRight="12px"><SentIcon /></Box>
            Completed
          </Box>
        )}
        {(isSending && !isSent) && (
          <Box fontSize="32px" fontWeight="700" display="flex" alignItems="center">
            <Box marginRight="12px"><SendingIcon /></Box>
            Sending
          </Box>
        )}
        {(!isSending && !isSent) && (
          <Box fontSize="32px" fontWeight="700">
            Review
          </Box>
        )}
        <Box marginTop="60px">
          <Box
            fontSize="14px"
            fontWeight="700"
            opacity="0.4"
          >
            Send
          </Box>
          <Box marginTop="8px" display="flex" alignItems="center">
            <Box marginRight="8px"><Image w="32px" h="32px" src={USDCIcon} /></Box>
            <Box fontSize="24px" fontWeight="600">10.1111 ETH</Box>
          </Box>

          <Box
            padding="10px 0"
            display="flex"
            alignItems="center"
            position="relative"
          >
          </Box>
        </Box>
        <Box marginTop="60px">
          <Box
            fontSize="14px"
            fontWeight="700"
            opacity="0.4"
          >
            To
          </Box>
          <Box
            marginTop="8px"
            alignItems="center"
            width="100%"
            display="inline-block"
          >
            <Box as="span" fontSize="24px" fontWeight="600">0x8d34</Box>
            <Box as="span" fontSize="24px" fontWeight="600" color="rgba(0, 0, 0, 0.4)">947d8cba2abd7e8d5b788c8a3674325c93d1</Box>
            <Box as="span" fontSize="24px" fontWeight="600">5c93d1</Box>
          </Box>

          <Box
            padding="10px 0"
            display="flex"
            alignItems="center"
            position="relative"
          >
          </Box>
        </Box>
        <Box
          fontSize="14px"
          fontWeight="700"
          opacity="0.4"
          marginTop="40px"
        >
          Network
        </Box>
        <Box onClick={onOpen} marginTop="8px" display="flex" alignItems="center">
          <Box marginRight="8px"><Image w="32px" h="32px" src={OpIcon} /></Box>
          <Box fontSize="20px" fontWeight="600">Optimism</Box>
          <Box width="40px" height="40px" display="flex" alignItems="center" justifyContent="center"><QuestionIcon /></Box>
        </Box>
        <Box
          fontSize="14px"
          fontWeight="700"
          opacity="0.4"
          marginTop="40px"
        >
          Fee
        </Box>
        <Box marginTop="8px" display="flex" alignItems="center">
          <Box fontSize="20px" fontWeight="600">$0</Box>
        </Box>
        {isSent && (
          <Box
            marginTop="40px"
            width="100%"
          >
            <Box width="100%" marginBottom="20px">
              <Button width="calc(100%)" disabled={false} size="xl" type="blue">Done</Button>
            </Box>
            <Box width="100%">
              <Button width="calc(100%)" disabled={false} size="xl" type="white">Copy transaction link</Button>
            </Box>
          </Box>
        )}
        {!isSent && (
          <Box
            marginTop="40px"
            width="100%"
            display="flex"
          >
            <Box width="50%" paddingRight="7px">
              <Button width="calc(100% - 7px)" disabled={false} size="xl" type="white" onClick={onPrev} color="black">Back</Button>
            </Box>
            <Box width="50%" paddingLeft="7px">
              <Button width="calc(100% - 7px)" disabled={false} size="xl" type="blue" onClick={() => { setIsSending(true); setTimeout(() => { setIsSent(true) }, 2000)}}>Continue</Button>
            </Box>
          </Box>
        )}
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
              height="80px"
              width="80px"
              borderRadius="80px"
              marginBottom="30px"
            >
              <Image src={OpIcon} />
            </Box>
            <Box fontSize="24px" fontWeight="700" marginBottom="14px">
              Optimism network
            </Box>
            <Box
              fontSize="16px"
              textAlign="center"
              marginBottom="40px"
            >
              Optimism is a Layer-2 scaling network for Ethereum that operates under a four-pillar design philosophy of simplicity, pragmatism, sustainability, and optimism.
            </Box>
            <Box width="100%">
              <Button size="xl" type="blue" width="100%" onClick={onClose}>Got it</Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
