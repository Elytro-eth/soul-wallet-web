import { Fragment } from 'react';
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  Input
} from '@chakra-ui/react'
import TextBody from '@/components/new/TextBody'
import Title from '@/components/new/Title'
import DropDownIcon from '@/components/Icons/DropDown';
import GuardianCard from '@/components/new/GuardianCard'
import Button from '@/components/Button'
import RecoverThreshold from '@/components/Guardian/RecoverThreshold'

export default function PendingGuardianModal({
  isOpen,
  closeModal,
}: any) {
  return (
    <Modal isOpen={isOpen} isCentered onClose={() => closeModal('pendingGuardian')}>
      <ModalOverlay />
      <ModalContent maxW={{base: "95%", lg :"840px"}} my={{base: "120px"}} borderRadius="20px">
        <ModalCloseButton top="14px" />
        <ModalHeader px="8">
          <Box fontWeight={'700'} fontSize={'20px'}>
            Pending new guardians
          </Box>
        </ModalHeader>
        <ModalBody
          overflow="auto"
        >
          <Box
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="100%" padding="0 10px">
              <Title fontSize="18px" fontWeight="700">Guardian list</Title>
              <Box>
                <Box
                  paddingTop="14px"
                  display="flex"
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  flexWrap="wrap"
                >
                  <GuardianCard
                    name={'No Name'}
                    address={'0xAAAA12345678E25FDa5f8a56B8e267fDaB6dS123'}
                    marginRight={{ base: '0px', md: '18px' }}
                    marginBottom="18px"
                    width={{ base: '100%', md: '272px' }}
                    cursor="pointer"
                  />
                  <GuardianCard
                    name={'No Name'}
                    address={'0xAAAA12345678E25FDa5f8a56B8e267fDaB6dS123'}
                    marginRight={{ base: '0px', md: '18px' }}
                    marginBottom="18px"
                    width={{ base: '100%', md: '272px' }}
                    cursor="pointer"
                  />
                  <GuardianCard
                    name={'No Name'}
                    address={'0xAAAA12345678E25FDa5f8a56B8e267fDaB6dS123'}
                    marginRight={{ base: '0px', md: '18px' }}
                    marginBottom="18px"
                    width={{ base: '100%', md: '272px' }}
                    cursor="pointer"
                  />
                  <GuardianCard
                    name={'No Name'}
                    address={'0xAAAA12345678E25FDa5f8a56B8e267fDaB6dS123'}
                    marginRight={{ base: '0px', md: '18px' }}
                    marginBottom="18px"
                    width={{ base: '100%', md: '272px' }}
                    cursor="pointer"
                  />
                  <GuardianCard
                    name={'No Name'}
                    address={'0xAAAA12345678E25FDa5f8a56B8e267fDaB6dS123'}
                    marginRight={{ base: '0px', md: '18px' }}
                    marginBottom="18px"
                    width={{ base: '100%', md: '272px' }}
                    cursor="pointer"
                  />
                </Box>
                <Box paddingTop="20px">
                  <Title
                    fontFamily="Nunito"
                    fontWeight="700"
                    fontSize="18px"
                    display="flex"
                  >
                    Recovery settings
                  </Title>
                  {true && (
                    <RecoverThreshold
                      threshold={0}
                      count={1}
                    />
                  )}
                </Box>
                <Box
                  marginTop="30px"
                  marginBottom="24px"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexDirection={{ base: 'column', md: 'row' }}
                >
                  <Box fontWeight="600" fontSize="14px">
                    New guardians updating in <Box as="span" color="#0CB700">12h : 56m : 03s</Box>
                  </Box>
                  <Box
                    marginTop={{ base: '20px', md: '0' }}
                  >
                    <Button type="white" padding="0 14px" marginRight="16px" onClick={() => {}} size="xl">Discard changes</Button>
                    <Button type="black" onClick={() => {}} size="xl">Confirm</Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
