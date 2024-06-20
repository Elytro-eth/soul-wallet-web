import { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Link,
  Image,
  Menu,
  MenuList,
  MenuItem,
  useToast,
} from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import EmailIcon from '@/assets/mobile/email-guardian.svg';
import GuardianIcon from '@/assets/mobile/guardian.svg';
import EmailGuardianIcon from '@/components/Icons/mobile/EmailGuardian';
import WalletGuardianIcon from '@/components/Icons/mobile/WalletGuardian';
import ChevronDown from '@/components/Icons/mobile/ChevronDown';
import EditIcon from '@/components/Icons/mobile/Edit';
import EditGuardianIcon from '@/components/Icons/mobile/Guardian/Edit';
import DeleteGuardianIcon from '@/components/Icons/mobile/Guardian/Delete';
import DeleteCircleGuardianIcon from '@/components/Icons/mobile/Guardian/DeleteCircle';
import ArrowDownIcon from '@/components/Icons/mobile/Guardian/ArrowDown';
import AddressIcon from '@/components/AddressIcon';
import useWalletContext from '@/context/hooks/useWalletContext';
import useScreenSize from '@/hooks/useScreenSize';
import { useGuardianStore } from '@/store/guardian';
import { useSettingStore } from '@/store/setting';
import { toShortAddress } from '@/lib/tools';
import { useNavigate } from 'react-router-dom';
import useRecover from '@/hooks/useRecover';

export default function Manage({ onPrev, onNext }: any) {
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

  const { isOpen: isSelectOpen, onOpen: onSelectOpen, onClose: onSelectClose } = useDisclosure();

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const { isOpen: isThresholdMenuOpen, onOpen: onThresholdMenuOpen, onClose: onThresholdMenuClose } = useDisclosure();

  const { isOpen: isGuardianMenuOpen, onOpen: onGuardianMenuOpen, onClose: onGuardianMenuClose } = useDisclosure();

  const { guardiansInfo } = useGuardianStore();
  const [showDetails, setShowDetails] = useState(false);
  const { guardianAddressEmail, guardianAddressName } = useSettingStore();
  const { openModal } = useWalletContext();
  const { innerHeight } = useScreenSize();
  const [activeGuardianIndex, setActiveGuardianIndex] = useState(-1);
  const [tempGuardians, setTempGuardians] = useState(guardiansInfo.guardianDetails.guardians);
  const [tempThreshold, setTempThreshold] = useState(guardiansInfo.guardianDetails.threshold);
  const [changingGuardian, setChangingGuardian] = useState(false);
  const { doSetGuardians } = useRecover();
  const toast = useToast();
  const navigate = useNavigate();

  const doHandleGuardian = (index: number) => {
    setActiveGuardianIndex(index);
    onSelectOpen();
  }

  const doDeleteGuardian = () => {
    setTempGuardians((prev:any) => prev.filter((_:any, index: number) => index !== activeGuardianIndex));
    onDeleteClose();
  }

  const onSetThreshold = (threshold: number) => {
    setTempThreshold(threshold);
    onThresholdMenuClose();
  }

  const doChangeGuardian = async () => {
    // do basic check
    setChangingGuardian(true);
    try {
      const guardianNames = tempGuardians.map((guardianAddress: any) => guardianAddressName[guardianAddress]);
      await doSetGuardians(tempGuardians, guardianNames, tempThreshold);
      toast({
        title: 'Guardian updated',
        status: 'success',
      })
      navigate('/dashboard');
    } finally {
      setChangingGuardian(false);
    }
  };

  return (
    <Box width="100%" height="100%" padding="30px" display="flex" flexDirection="column">
      <Box fontSize="16px" fontWeight="600">
        My guardians
      </Box>
      <Box marginTop="14px">
        {tempGuardians.map((guardianAddress: any, index: number) => (
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
              <Box fontSize="16px" fontWeight="600">
                {guardianAddressEmail[guardianAddress]
                ? 'Email guardian'
                : guardianAddressName[guardianAddress]
                ? guardianAddressName[guardianAddress]
                : 'Guardian'}
              </Box>
              <Box fontSize="12px" fontWeight="500" marginTop="4px" color="#868686">
                {guardianAddressEmail[guardianAddress] ? guardianAddressEmail[guardianAddress] : toShortAddress(guardianAddress)}
              </Box>
            </Box>
            <Box marginLeft="auto" onClick={()=> doHandleGuardian(index)}>
              <EditIcon />
            </Box>
          </Box>
        ))}
      </Box>
      <Box marginBottom="40px" position="relative">
        <Button fontSize="14px" size="xl" type="white" color="black" onClick={onGuardianMenuOpen}>
          +Add {tempGuardians.length ? 'another' : ''} guardian
        </Button>
        <Box position="absolute" top="60px" left="0">
          <Menu isOpen={isGuardianMenuOpen} isLazy>
            {() => (
              <Box overflow="auto">
                <MenuList background="white" boxShadow="0px 4px 20px 0px rgba(0, 0, 0, 0.05)">
                  <MenuItem
                    width="calc(100vw - 60px)"
                    position="relative"
                    padding="18px 27px"
                    borderBottom="1px solid #E4E4E4"
                    onClick={() => {
                      openModal('verifyEmail', {
                        callback: () => {console.log('1111')}
                      });
                      onGuardianMenuClose();
                    }}
                  >
                    <Box fontSize="16px" fontWeight="500" display="flex" alignItems="center">
                      <Box marginRight="8px">
                        <EmailGuardianIcon />
                      </Box>
                      <Box>Email</Box>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    width="calc(100vw - 60px)"
                    position="relative"
                    padding="18px 27px"
                    onClick={() => {
                      openModal('addWalletGuardian', {
                        callback: () => {console.log('11121')}
                      });
                      onGuardianMenuClose();
                    }}
                  >
                    <Box fontSize="16px" fontWeight="500" display="flex" alignItems="center">
                      <Box marginRight="8px">
                        <WalletGuardianIcon />
                      </Box>
                      <Box>Wallet</Box>
                    </Box>
                  </MenuItem>
                </MenuList>
              </Box>
            )}
          </Menu>
        </Box>
      </Box>
      {tempGuardians.length > 0 && <Box>
        <Box width="100%" height="1px" background="#F0F0F0" marginBottom="40px" />
          <Box fontSize="16px" fontWeight="600">
            Recovery settings
          </Box>
          <Box marginBottom="14px" marginTop="12px" position="relative">
            <Button
              borderRadius="8px"
              width="100%"
              size="xl"
              type="white"
              color="black"
              onClick={() => {
                isThresholdMenuOpen ? onThresholdMenuClose() : onThresholdMenuOpen();
              }}
            >
              {tempThreshold}
            </Button>
            <Box position="absolute" right="16px" top="calc(50% - 6px)">
              <ArrowDownIcon />
            </Box>
            <Box position="absolute" top="60px" left="0" width="100%">
              <Menu isOpen={isThresholdMenuOpen} isLazy>
                {() => (
                  <Box overflow="auto">
                    <MenuList background="white" boxShadow="0px 4px 20px 0px rgba(0, 0, 0, 0.05)">
                      {Array.from({ length: tempGuardians.length }, (_, i) => (
                        <MenuItem
                          position="relative"
                          padding="18px 27px"
                          w="calc(100vw - 60px)"
                          maxW="370px"
                          onClick={() => onSetThreshold(i + 1)}
                        >
                          <Box fontSize="16px" fontWeight="500" display="flex" alignItems="center">
                            <Box>{i + 1}</Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Box>
                )}
              </Menu>
            </Box>
          </Box>
          <Box marginBottom="20px">out of {tempGuardians.length} guardian(s) confirmation is needed for wallet recovery.</Box>
      </Box>}
      <Box marginTop="auto" width="100%" display="flex" paddingBottom="20px">
            <Box width="50%" paddingRight="7px">
              <Button width="calc(100% - 7px)" disabled={false} size="xl" type="white" onClick={onPrev} color="black">
                Back
              </Button>
            </Box>
            <Box width="50%" paddingLeft="7px">
              <Button width="calc(100% - 7px)" disabled={false} size="xl" type="blue" onClick={onConfirmOpen}>
                Continue
              </Button>
            </Box>
          </Box>
      <Modal isOpen={isSelectOpen} onClose={onSelectClose} motionPreset="slideInBottom">
        <ModalOverlay height="100vh" />
        <ModalContent
          borderRadius={{
            sm: '20px 20px 0 0',
            md: '20px',
          }}
          maxW={{
            sm: '100vw',
            md: '430px',
          }}
          marginTop={{
            sm: `${innerHeight - 154}px`,
            md: 'calc(50vh - 125px)',
          }}
          height="154px"
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
            padding="0"
          >
            <Box width="100%">
              <Box
                height="48px"
                display="flex"
                alignItems="center"
                padding="0 23px"
                onClick={() => {
                  onSelectClose();
                  openModal('addWalletGuardian');
                }}
              >
                <Box marginRight="4px">
                  <EditGuardianIcon />
                </Box>
                <Box fontSize="16px" fontWeight="600">
                  Edit
                </Box>
              </Box>
              <Box
                height="48px"
                display="flex"
                alignItems="center"
                padding="0 23px"
                marginTop="8px"
                onClick={() => {
                  onSelectClose();
                  onDeleteOpen();
                }}
              >
                <Box marginRight="4px">
                  <DeleteGuardianIcon />
                </Box>
                <Box fontSize="16px" fontWeight="600">
                  Delete
                </Box>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} motionPreset="slideInBottom" blockScrollOnMount={true}>
        <ModalOverlay height="100vh" />
        <ModalContent
          borderRadius={{
            sm: '20px 20px 0 0',
            md: '20px',
          }}
          maxW={{
            sm: '100vw',
            md: '430px',
          }}
          marginTop={{
            sm: `${innerHeight - 468}px`,
            md: 'calc(50vh - 125px)',
          }}
          height="468px"
          overflow="auto"
          mb="0"
        >
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
            <Box
              // background="#D9D9D9"
              height="100px"
              width="100px"
              borderRadius="100px"
              marginBottom="24px"
            >
              <DeleteCircleGuardianIcon />
            </Box>
            <Box fontSize="24px" fontWeight="700" marginBottom="14px">
              Delete guardian
            </Box>
            <Box fontSize="16px" textAlign="center" marginBottom="10px">
              {`Are you sure to remove <${toShortAddress(tempGuardians[activeGuardianIndex], 6)}> as guardian?`}
            </Box>
            <Box width="100%" marginTop="20px">
              <Button size="xl" type="blue" width="100%" onClick={() => doDeleteGuardian()}>
                Delete
              </Button>
              <Button size="xl" type="white" width="100%" marginTop="20px" onClick={onDeleteClose}>
                Cancel
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} motionPreset="slideInBottom" blockScrollOnMount={true}>
        <ModalOverlay height="100vh" />
        <ModalContent
          borderRadius={{
            sm: '20px 20px 0 0',
            md: '20px',
          }}
          maxW={{
            sm: '100vw',
            md: '430px',
          }}
          marginTop={{
            sm: `${innerHeight - 468}px`,
            md: 'calc(50vh - 125px)',
          }}
          height="468px"
          overflow="auto"
          mb="0"
        >
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
            <Box background="#D9D9D9" height="120px" width="120px" borderRadius="120px" marginBottom="30px"></Box>
            <Box fontSize="24px" fontWeight="700" marginBottom="14px">
              Confirm guardian update
            </Box>
            <Box fontSize="16px" textAlign="center" marginBottom="10px">
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
              <Box marginLeft="2px" transform={showDetails ? 'rotate(-180deg)' : 'rotate(0deg)'}>
                <ChevronDown />
              </Box>
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
              <Button size="xl" loading={changingGuardian} type="blue" width="100%" onClick={() => doChangeGuardian()}>
                Confirm
              </Button>
              <Button size="xl" type="white" width="100%" marginTop="20px" onClick={onConfirmClose}>
                Cancel
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
