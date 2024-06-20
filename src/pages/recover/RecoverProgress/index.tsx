import { useState } from 'react';
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
} from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import EmailIcon from '@/assets/mobile/email-guardian.svg';
import ChevronDown from '@/components/Icons/mobile/ChevronDown';
import CopyIcon from '@/components/Icons/mobile/Copy';
import WaitingIcon from '@/components/Icons/mobile/Waiting';
import ApprovedIcon from '@/components/Icons/mobile/Approved';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useTempStore } from '@/store/temp';
import api from '@/lib/api';
import { useSettingStore } from '@/store/setting';
import { useGuardianStore } from '@/store/guardian';
import { toShortAddress } from '@/lib/tools';

export default function RecoverProgress({ onNext, signedGuardians }: any) {
  const { openModal } = useWalletContext();
  const { recoverInfo, setEmailTemplate } = useTempStore();
  const { guardianAddressEmail } = useSettingStore();
  const { guardianInfo } = recoverInfo;

  const doOpenModal = async (guardianAddress: string) => {
    // get template info
    const res = await api.emailGuardian.emailTemplate({
      email: guardianAddressEmail[guardianAddress],
      guardianAddress,
      recoveryID: recoverInfo.recoveryID,
    });

    console.log('template info');
    setEmailTemplate({
      ...res.data,
      mailToLink: `mailto:${res.data.to}?subject=${res.data.subject}&body=${res.data.body}`,
    });
    openModal('recoverVerifyEmail');
  };

  const shareLink = `${location.origin}/public/sign/${recoverInfo.recoveryID}`

  console.log('share link', shareLink)

  const guardiansList = guardianInfo && guardianInfo.guardians ? guardianInfo.guardians : []

  const pendingGuardianNum = guardiansList.length - signedGuardians.length;

  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="40px">
      <Box width="120px" height="120px" borderRadius="120px" margin="0 auto" background="#F2F2F2" opacity="0.55"></Box>
      <Box width="100%" textAlign="center" fontSize="23px" fontWeight="700" marginTop="20px" letterSpacing="-1px">
        Share link with your guardians
      </Box>
      <Box width="100%" textAlign="center" fontSize="14px" fontWeight="400" marginTop="12px">
        Ask your guardians to recover for you
      </Box>
      <Button onClick={onNext} size="xl" type="blue" width="100%" marginTop="30px" marginBottom="60px">
        Share
      </Button>
      <Box fontWeight="700" fontSize="18px" width="100%" paddingBottom="24px" borderBottom="1px solid #F0F0F0">
        {pendingGuardianNum} more guardians approval needed
      </Box>
      {guardiansList &&
        guardiansList.map((guardianAddress: any, index: number) => (
          <Box
            fontWeight="600"
            fontSize="14px"
            key={index}
            width="100%"
            padding="24px 0"
            borderBottom="1px solid #F0F0F0"
            display="flex"
            alignItems="center"
          >
            <Box width="32px" height="32px" background="#D9D9D9" borderRadius="32px" marginRight="8px" />
            <Box>
              <Box wordBreak={"break-all"}>{guardianAddressEmail[guardianAddress] || toShortAddress(guardianAddress, 6) }</Box>
            </Box>
            <Box marginLeft="auto">
              {signedGuardians.includes(guardianAddress) ? (
                <Box
                  color="#0CB700"
                  background="#F5FFF4"
                  padding="2px 8px"
                  borderRadius="24px"
                  fontWeight="600"
                  display="flex"
                  alignItems="center"
                >
                  <Box marginRight="4px">
                    <ApprovedIcon />
                  </Box>
                  <Box>Approved</Box>
                </Box>
              ) : guardianAddressEmail[guardianAddress] ? (
                <Button size="sm" type="blue" height="32px" onClick={() => doOpenModal(guardianAddress)}>
                  Verify Email
                </Button>
              ) : (
                <Box
                  color="#848488"
                  background="#F3F3F3"
                  padding="2px 8px"
                  borderRadius="24px"
                  display="flex"
                  alignItems="center"
                >
                  <Box marginRight="4px">
                    <WaitingIcon />
                  </Box>
                  <Box>Waiting</Box>
                </Box>
              )}
            </Box>
          </Box>
        ))}

      {/* <Box
        fontWeight="600"
        fontSize="14px"
        width="100%"
        padding="24px 0"
        borderBottom="1px solid #F0F0F0"
        display="flex"
        alignItems="center"
      >
        <Box width="32px" height="32px" background="#D9D9D9" borderRadius="32px" marginRight="8px" />
        <Box>
          <Box>{`Helloworld.eth`}</Box>
          <Box>{`(0xAAA......dS123)`}</Box>
        </Box>
        <Box marginLeft="8px"><CopyIcon /></Box>
        <Box marginLeft="auto">
       
        </Box>
      </Box>
      <Box
        fontWeight="600"
        fontSize="14px"
        width="100%"
        padding="24px 0"
        borderBottom="1px solid #F0F0F0"
        display="flex"
        alignItems="center"
      >
        <Box width="32px" height="32px" background="#D9D9D9" borderRadius="32px" marginRight="8px" />
        <Box>
          <Box>{`ne****ez@gmail.com`}</Box>
        </Box>
        <Box marginLeft="8px"><CopyIcon /></Box>
        <Box marginLeft="auto">
          <Box marginLeft="auto">
          
          </Box>
        </Box>
      </Box> */}
    </Box>
  );
}
