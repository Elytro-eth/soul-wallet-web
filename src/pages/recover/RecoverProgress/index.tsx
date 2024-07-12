// @ts-nocheck
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
  Flex,
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
import { shareUrl, toShortAddress } from '@/lib/tools';
import useTools from '@/hooks/useTools';
import AddressIcon from '@/components/AddressIcon';
import GuardianIcon from '@/assets/guardian.svg'
import useScreenSize from '@/hooks/useScreenSize'

export default function RecoverProgress({ onNext, signedGuardians }: any) {
  const { openModal } = useWalletContext();
  const { recoverInfo, setEmailTemplate } = useTempStore();
  const { guardianAddressEmail } = useSettingStore();
  const { guardianInfo } = recoverInfo;
  const { doCopy } = useTools();
  const { innerHeight } = useScreenSize()

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
      mailToLink: `mailto:${res.data.to}?subject=${res.data.subject}`,
    });
    openModal('recoverVerifyEmail');
  };

  const shareLink:any = `${location.origin}/public/sign/${recoverInfo.recoveryID}`

  const onShare = () => {
    if (!navigator.share) {
      doCopy(shareLink)
    } else {
      shareUrl(shareLink)
    }
  }

  const guardiansList = guardianInfo && guardianInfo.guardians ? guardianInfo.guardians : []

  const pendingGuardianNum = guardianInfo && guardianInfo.threshold ? guardianInfo.threshold - signedGuardians.length : 0;

  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="40px">
      <Box
        marginBottom="40px"
        height="116px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Image height="116px" src={GuardianIcon} />
      </Box>
      <Box width="100%" textAlign="center" fontSize="28px" fontWeight="500" marginTop="20px" letterSpacing="-1px" color="#161F36">
        Share link with your recovery contacts
      </Box>
      <Box width="100%" textAlign="center" fontSize="14px" fontWeight="400" marginTop="12px" color="#676B75">
        Ask them to connect wallet and sign the signature to recover for you.
      </Box>
      <Button onClick={onShare} size="xl" type="gradientBlue" width="100%" marginTop="24px" marginBottom="40px">
        Share
      </Button>
      <Box fontWeight="500" fontSize="14px" width="100%" paddingTop="12px" paddingBottom="12px" borderTop="1px solid #BDC0C7" color="#161F36">
        {pendingGuardianNum} more confirmations needed
      </Box>
      {guardiansList &&
       guardiansList.map((guardianAddress: any, index: number) => {
          const isEmail = guardianAddressEmail[guardianAddress] ? true : false;
         const label = guardianAddressEmail[guardianAddress] || toShortAddress(guardianAddress, 6);
         return <Box
                  fontWeight="500"
                  fontSize="14px"
                  key={index}
                  width="100%"
                  padding="16px 0"
                  height="64px"
                  borderBottom="1px solid #F0F0F0"
                  display="flex"
                  alignItems="center"
                >
           {/* <AddressIcon width={32} address={guardianAddress} /> */}
           <Flex align={'center'} gap="2" ml={"2"}>
             <Box wordBreak={"break-all"} fontSize="14px" fontWeight="500" color="#161F36">{label}</Box>
             {!isEmail && <Box onClick={()=> doCopy(label)}><CopyIcon /></Box>}
           </Flex>
           <Box marginLeft="auto">
             {(signedGuardians.includes(guardianAddress)) ? (
               <Box
                 color="#92EF5A"
                 background="#1E4124"
                 padding="2px 12px"
                 borderRadius="24px"
                 fontWeight="400"
                 display="flex"
                 alignItems="center"
                 fontSize="12px"
                 height="31px"
               >
                 <Box marginRight="4px">
                   <ApprovedIcon />
                 </Box>
                 <Box>Approved</Box>
               </Box>
             ) : guardianAddressEmail[guardianAddress] ? (
               <Button size="sm" type="lightBlue" height="31px" onClick={() => doOpenModal(guardianAddress)} color="#161F36">
                 Verify Email
               </Button>
             ) : (
               <Box
                 color="#848488"
                 background="#F3F3F3"
                 padding="2px 12px"
                 borderRadius="24px"
                 display="flex"
                 alignItems="center"
                 height="31px"
               >
                 <Box marginRight="4px">
                   <WaitingIcon />
                 </Box>
                 <Box>Waiting</Box>
               </Box>
             )}
           </Box>
         </Box>
      })}
      <Box height="90px" />
    </Box>
  );
}
