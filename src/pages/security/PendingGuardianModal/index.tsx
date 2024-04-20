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
import EditGuardianForm from '../EditGuardianForm'

export default function PendingGuardianModal({
  isOpen,
  onClose,
}: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
                    <Fragment>
                      <Box
                        display="flex"
                        justifyContent="flex-start"
                        marginTop="10px"
                        alignItems={{ base: 'flex-start', md: 'center' }}
                        flexDirection={{ base: 'column', md: 'row' }}
                      >
                        <Box
                          fontFamily="Nunito"
                          fontWeight="700"
                          fontSize="14px"
                          marginRight="6px"
                        >
                          Threshold:
                        </Box>
                        <TextBody
                          type="t2"
                          justifyContent="flex-start"
                          display="flex"
                          flexDirection={{ base: 'column', md: 'row' }}
                          alignItems={{ base: 'flex-start', md: 'center' }}
                        >
                          <Box>Wallet recovery requires</Box>
                          <Box
                            width="80px"
                            margin={{ base: '0', md: '0 10px' }}
                          >
                            <Box
                              px={2}
                              py={2}
                              width="80px"
                              transition="all 0.2s"
                              borderRadius="16px"
                              borderWidth="1px"
                              padding="12px"
                              background="white"
                              _expanded={{
                                borderColor: '#3182ce',
                                boxShadow: '0 0 0 1px #3182ce',
                              }}
                            >
                              <Box display="flex" alignItems="center" justifyContent="space-between">
                                {0}
                                <DropDownIcon />
                              </Box>
                            </Box>
                          </Box>
                          <Box>{`out of ${1} guardian(s) confirmation.`}</Box>
                        </TextBody>
                      </Box>
                    </Fragment>
                  )}
                </Box>
                <Box
                  marginTop="30px"
                  marginBottom="24px"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box fontWeight="600" fontSize="14px">
                    New guardians updating in <Box as="span" color="#0CB700">12h : 56m : 03s</Box>
                  </Box>
                  <Box>
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
