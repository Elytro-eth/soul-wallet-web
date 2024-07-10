import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Link,
  Image,
  Menu,
  MenuList,
  MenuItem,
  useToast,
  useOutsideClick,
  MenuButton
} from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import EmailIcon from '@/assets/mobile/email-guardian.svg';
import GuardianIcon from '@/assets/mobile/guardian.svg';
import EmailGuardianIcon from '@/components/Icons/mobile/EmailGuardian';
import WalletGuardianIcon from '@/components/Icons/mobile/WalletGuardian';
import EditGuardianIcon from '@/components/Icons/mobile/EditGuardian';
import DeleteGuardianIcon from '@/components/Icons/mobile/DeleteGuardian';
import ChevronDown from '@/components/Icons/mobile/ChevronDown';
import EditIcon from '@/components/Icons/mobile/Edit';
// import EditGuardianIcon from '@/components/Icons/mobile/Guardian/Edit';
// import DeleteGuardianIcon from '@/components/Icons/mobile/Guardian/Delete';
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
import useWalletContract from '@/hooks/useWalletContract';
import MinusIcon from '@/components/Icons/mobile/Minus';
import AddIcon from '@/components/Icons/mobile/Add';
import IntroGuardianIcon from '@/assets/guardian.svg'
import WarningIcon from '@/components/Icons/Warning';
import { useOutletContext } from "react-router-dom"
import FadeId from '@/components/Icons/mobile/FaceId'

export default function Manage() {
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

  const { isOpen: isSelectOpen, onOpen: onSelectOpen, onClose: onSelectClose } = useDisclosure();

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const { isOpen: isThresholdMenuOpen, onOpen: onThresholdMenuOpen, onClose: onThresholdMenuClose } = useDisclosure();

  const { isOpen: isGuardianMenuOpen, onOpen: onGuardianMenuOpen, onClose: onGuardianMenuClose } = useDisclosure();

  const { guardiansInfo } = useGuardianStore();
  const [showDetails, setShowDetails] = useState(false);
  const { guardianAddressEmail, guardianAddressName, saveGuardianAddressName, saveGuardianAddressEmail } = useSettingStore();
  const { openModal, closeModal, } = useWalletContext();
  const { innerHeight } = useScreenSize();
  const [activeGuardianIndex, setActiveGuardianIndex] = useState(-1);
  const [tempGuardians, setTempGuardians] = useState(guardiansInfo.guardianDetails.guardians);
  const [tempThreshold, setTempThreshold] = useState(guardiansInfo.guardianDetails.threshold);
  const [changingGuardian, setChangingGuardian] = useState(false);
  const { doSetGuardians } = useRecover();
  const [isEditing, setIsEditing] = useState(false)
  const toast = useToast();
  const navigate = useNavigate();
  const guardianMenuRef = useRef<any>()
  const thresholdMenuRef = useRef<any>()
  const [onPrev] = useOutletContext<any>()

  useOutsideClick({
    ref: guardianMenuRef,
    handler: () => onGuardianMenuClose(),
  })

  useOutsideClick({
    ref: thresholdMenuRef,
    handler: () => onThresholdMenuClose(),
  })

  const doHandleGuardian = (index: number) => {
    setActiveGuardianIndex(index);
    onSelectOpen();
  };

  const doDeleteGuardian = () => {
    setTempGuardians((prev: any) => prev.filter((_: any, index: number) => index !== activeGuardianIndex));
    onDeleteClose();
  };

  const onSetThreshold = (threshold: number) => {
    setTempThreshold(threshold);
    onThresholdMenuClose();
  };

  const doChangeGuardian = async () => {
    // do basic check
    setChangingGuardian(true);
    try {
      const guardianNames = tempGuardians.map((guardianAddress: any) => guardianAddressName[guardianAddress]);
      await doSetGuardians(tempGuardians, guardianNames, tempThreshold);
      toast({
        title: 'Recovery contact updated',
        status: 'success',
      });
      navigate('/dashboard');
    } finally {
      setChangingGuardian(false);
    }
  };

  const onEditGuardianOpen = () => {
    const guardianAddress = tempGuardians[activeGuardianIndex];
    const guardianName = guardianAddressName[guardianAddress];
    const guardianEmail = guardianAddressEmail[guardianAddress];
    if (guardianEmail) {
      openModal('verifyEmailGuardian', {
        defaultGuardianEmail: guardianEmail,
        callback: (guardianAddress: string, guardianEmail: string) => {
          setTempGuardians((prev: any) => {
            const newGuardians = [...prev];
            newGuardians[activeGuardianIndex] = guardianAddress;
            return newGuardians;
          });
          saveGuardianAddressEmail(guardianAddress, guardianEmail);
          closeModal();
        },
      });
    } else {
      openModal('addWalletGuardian', {
        defaultGuardianAddress: guardianAddress,
        defaultGuardianName: guardianName,
        callback: (guardianAddress: string, guardianName: string) => {
          saveGuardianAddressName(guardianAddress, guardianName);
          setTempGuardians((prev: any) => {
            const newGuardians = [...prev];
            newGuardians[activeGuardianIndex] = guardianAddress;
            return newGuardians;
          });
          closeModal();
        },
      });
    }
  };

  const onCreateGuardianOpen = (guardianType: number) => {
    onGuardianMenuClose();
    if (guardianType === 0) {
      openModal('verifyEmailGuardian', {
        defaultEmail: "",
        callback: (guardianAddress: string, guardianEmail: string) => {
          setTempGuardians((prev: any) => {
            return [
              ...prev,
              guardianAddress,
            ]
          });
          saveGuardianAddressEmail(guardianAddress, guardianEmail);
          closeModal();
        },
      });
    } else if(guardianType === 1) {
      openModal('addWalletGuardian', {
        callback: (guardianAddress: string, guardianName: string) => {
          saveGuardianAddressName(guardianAddress, guardianName);
          setTempGuardians((prev: any) => {
            return [
              ...prev,
              guardianAddress,
            ]
          });
          closeModal();
        },
      });
    }
  };

  useEffect(()=>{
    if(tempGuardians.length === 0) {
      setTempThreshold(0);
    }else if(tempGuardians.length < tempThreshold) {
      setTempThreshold(tempGuardians.length);
    }
  }, [tempGuardians])

  const isActiveGuardianEmail = guardianAddressEmail[tempGuardians[activeGuardianIndex]];

  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      <Box padding="30px">
        <Box fontSize="14px" fontWeight="500" color="#161F36" lineHeight="17.5px">
          MY RECOVERY CONTACTS
        </Box>
        <Box marginTop="14px">
          {tempGuardians.map((guardianAddress: any, index: number) => (
            <Box
              // border="1px solid #DFDFDF"
              background="#F2F3F5"
              borderRadius="16px"
              padding="22px 24px"
              display="flex"
              alignItems="center"
              marginBottom="16px"
              key={index}
            >
              <Box width="48px" height="48px" marginRight="8px">
                <AddressIcon address={guardianAddress} width={48} />
              </Box>
              <Box>
                <Box fontSize="18px" fontWeight="400" color="#161F36" lineHeight="22.5px">
                  {guardianAddressEmail[guardianAddress]
                  ? 'Email recovery contact'
                  : guardianAddressName[guardianAddress]
                  ? guardianAddressName[guardianAddress]
                  : 'Recovery contact'}
                </Box>
                <Box fontSize="12px" fontWeight="500" marginTop="4px" lineHeight="18px" color="#676B75">
                  {guardianAddressEmail[guardianAddress]
                  ? guardianAddressEmail[guardianAddress]
                  : toShortAddress(guardianAddress)}
                </Box>
              </Box>
              {isEditing && (
                <Box marginLeft="auto" onClick={() => doHandleGuardian(index)}>
                  <EditIcon />
                </Box>
              )}
            </Box>
          ))}
        </Box>
        {isEditing && (
          <Box marginBottom="40px" position="relative">
            <Box>
              <Menu isOpen={isGuardianMenuOpen} isLazy autoSelect={false}>
                {() => (
                  <Box overflow="auto" ref={guardianMenuRef}>
                    <MenuButton as={Box} onClick={() => { isGuardianMenuOpen ? onGuardianMenuClose() : onGuardianMenuOpen(); }}>
                      <Button fontSize="14px" size="lg" type="white" color="#161F36" fontWeight="400">
                        +Add {tempGuardians.length ? 'another' : ''} recovery contact
                      </Button>
                    </MenuButton>
                  </Box>
                )}
              </Menu>
            </Box>
          </Box>
        )}
        {!isEditing && (
          <Box height="40px" width="1px" />
        )}
        {tempGuardians.length > 0 && (
          <Box>
            <Box fontSize="14px" fontWeight="500" color="#161F36" lineHeight="17.5px">
              RECOVERY SETTINGS
            </Box>
            <Box background="#F2F3F5" padding="16px" marginTop="16px" borderRadius="16px">
              <Box marginBottom="14px" marginTop="12px" position="relative">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  {isEditing && (
                    <Box
                      width="72px"
                      height="48px"
                      borderRadius="8px"
                      background="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      onClick={() => { if (tempThreshold - 1 > 0) { onSetThreshold(tempThreshold - 1) } }}
                    >
                      <MinusIcon />
                    </Box>
                  )}
                  {!isEditing && (
                    <Box
                      width="72px"
                      height="48px"
                    />
                  )}
                  <Box fontWeight="500" fontSize="32px" color="#161F36">{tempThreshold}</Box>
                  {isEditing && (
                    <Box
                      width="72px"
                      height="48px"
                      borderRadius="8px"
                      background="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      onClick={() => { if (tempThreshold + 1 <= tempGuardians.length) { onSetThreshold(tempThreshold + 1) } }}
                    >
                      <AddIcon />
                    </Box>
                  )}
                  {!isEditing && (
                    <Box
                      width="72px"
                      height="48px"
                    />
                  )}
                </Box>
              </Box>
              <Box marginTop="8px" marginBottom="20px" fontSize="12px" fontWeight="400" textAlign="center" color="#3C3F45">
                out of {tempGuardians.length} recovery contact(s) confirmation is needed for wallet recovery.
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      {isEditing && (
        <Box marginTop="auto" width="100%" display="flex" paddingBottom="20px" padding="30px" borderTop="1px solid #F2F3F5">
          <Box width="50%" paddingRight="7px">
            <Button width="calc(100% - 7px)" disabled={false} size="xl" type="white" onClick={() => setIsEditing(false)} color="black">
              Cancel
            </Button>
          </Box>
          <Box width="50%" paddingLeft="7px">
            <Button width="calc(100% - 7px)" disabled={false} size="xl" type="gradientBlue" onClick={onConfirmOpen}>
              Save
            </Button>
          </Box>
        </Box>
      )}
      {!isEditing && (
        <Box marginTop="auto" width="100%" display="flex" paddingBottom="20px" padding="30px" borderTop="1px solid #F2F3F5">
          <Button width="100%" disabled={false} size="xl" type="white" onClick={() => setIsEditing(true)} color="black">
            Edit
          </Button>
        </Box>
      )}

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
              <WarningIcon size="96" />
            </Box>
            <Box fontSize="24px" fontWeight="500" marginBottom="14px">
              Delete recovery contact
            </Box>
            <Box fontSize="16px" textAlign="center" marginBottom="10px">
              {`Are you sure to remove <${toShortAddress(tempGuardians[activeGuardianIndex], 6)}> as recovery contact?`}
            </Box>
            <Box width="100%" marginTop="20px">
              <Button size="xl" type="red" width="100%" onClick={() => doDeleteGuardian()}>
                Delete
              </Button>
              <Button size="xl" type="white" width="100%" marginTop="8px" onClick={onDeleteClose}>
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
            sm: `${innerHeight - 528}px`,
            md: 'calc(50vh - 125px)',
          }}
          height="528px"
          overflow="auto"
          mb="0"
        >
          <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%" paddingTop="30px">
            <Box height="144px" width="144px" borderRadius="120px" marginBottom="30px">
              <Image height="144px" width="144px" src={IntroGuardianIcon} />
            </Box>
            <Box fontSize="28px" fontWeight="500" marginBottom="14px" color="#161F36" textAlign="center">
              Confirm update
            </Box>
            <Box fontSize="14px" lineHeight="17.5px" textAlign="center" marginBottom="10px" color="#676B75">
              Please confirm recovery contact updates on your Soul Wallet account.
            </Box>
            {/* <Box
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
                </Box> */}
            {/* {showDetails && (
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
                )} */}
            <Box width="100%" marginTop="20px">
              <Button size="xl" loading={changingGuardian} type="gradientBlue" width="100%" onClick={() => doChangeGuardian()}>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Box marginRight="8px"><FadeId /></Box>
                  <Box>Confirm</Box>
                </Box>
              </Button>
              <Button size="xl" type="white" width="100%" marginTop="8px" onClick={onConfirmClose}>
                Cancel
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isGuardianMenuOpen}
        onClose={onGuardianMenuClose}
        motionPreset="slideInBottom"
        blockScrollOnMount={true}
      >
        <ModalOverlay height="100vh" background="transparent" />
        <ModalContent
          borderRadius="24px"
          justifyContent="flex-end"
          maxW={{
            sm: 'calc(100vw - 32px)',
            md: '430px',
          }}
          marginTop={{
            sm: `auto`,
            md: 'calc(50vh - 125px)',
          }}
          overflow="visible"
          mb="0"
          bottom="30px"
          position="relative"
          overflowY="scroll"
          boxShadow="0px 12px 16px -4px rgba(0, 0, 0, 0.08)"
        >
          <ModalCloseButton />
          <ModalHeader fontSize="20px" fontWeight="500" color="#161F36" paddingBottom="2">Add recovery contact via...</ModalHeader>
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="center"
            width="100%"
            paddingLeft="0"
            paddingRight="0"
          >
            <Box
              background="white"
              width="100%"
              padding="0 16px"
            >
              <Box
                width="calc(100%)"
                position="relative"
                padding="0 16px"
                display="flex"
                alignItems="center"
                height="56px"
                background="#F2F3F5"
                borderRadius="16px"
                marginBottom="8px"
                onClick={() => { onCreateGuardianOpen(1); onGuardianMenuClose(); }}
              >
                <Box marginRight="8px"><WalletGuardianIcon /></Box>
                <Box fontWeight="500" fontSize="18px" color="#161F36">
                  Wallet
                </Box>
              </Box>
              <Box
                width="calc(100%)"
                position="relative"
                padding="0 16px"
                display="flex"
                alignItems="center"
                height="56px"
                background="#F2F3F5"
                borderRadius="16px"
                marginBottom="8px"
                onClick={() => { onCreateGuardianOpen(0); onGuardianMenuClose(); }}
              >
                <Box marginRight="8px"><EmailGuardianIcon /></Box>
                <Box fontWeight="500" fontSize="18px" color="#161F36">
                  Mail
                </Box>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isSelectOpen}
        onClose={onSelectClose}
        motionPreset="slideInBottom"
        blockScrollOnMount={true}
      >
        <ModalOverlay height="100vh" background="transparent" />
        <ModalContent
          borderRadius="24px"
          justifyContent="flex-end"
          maxW={{
            sm: 'calc(100vw - 32px)',
            md: '430px',
          }}
          marginTop={{
            sm: `auto`,
            md: 'calc(50vh - 125px)',
          }}
          overflow="visible"
          mb="0"
          bottom="30px"
          position="relative"
          overflowY="scroll"
          boxShadow="0px 12px 16px -4px rgba(0, 0, 0, 0.08)"
        >
          <ModalCloseButton />
          <ModalHeader fontSize="20px" fontWeight="500" color="#161F36" paddingBottom="2">Edit recovery contact</ModalHeader>
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="center"
            width="100%"
            paddingLeft="0"
            paddingRight="0"
          >
            <Box
              background="white"
              width="100%"
              padding="0 16px"
            >
              <Box
                width="calc(100%)"
                position="relative"
                padding="0 16px"
                display="flex"
                alignItems="center"
                height="56px"
                background="#F2F3F5"
                borderRadius="16px"
                marginBottom="8px"
                onClick={() => { onSelectClose(); onEditGuardianOpen(); }}
              >
                <Box marginRight="8px"><EditGuardianIcon /></Box>
                <Box fontWeight="500" fontSize="18px" color="#161F36">
                  Edit
                </Box>
              </Box>
              <Box
                width="calc(100%)"
                position="relative"
                padding="0 16px"
                display="flex"
                alignItems="center"
                height="56px"
                background="#FCE9EA"
                borderRadius="16px"
                marginBottom="8px"
                onClick={() => { onDeleteOpen(); onSelectClose(); }}
              >
                <Box marginRight="8px"><DeleteGuardianIcon /></Box>
                <Box fontWeight="500" fontSize="18px" color="#E8424C">
                  Delete
                </Box>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
