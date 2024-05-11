import { useState, useCallback } from 'react';
import { Box, Tooltip } from '@chakra-ui/react';
import RoundContainer from '@/components/new/RoundContainer';
import Heading from '@/components/new/Heading';
import TextBody from '@/components/new/TextBody';
import Button from '@/components/Button';
import { useTempStore } from '@/store/temp';
import CopyIcon from '@/components/Icons/Copy';
import OpenScanIcon from '@/components/Icons/OpenScan';
import { toShortAddress } from '@/lib/tools';
import useTools from '@/hooks/useTools';
import StepProgress from '../StepProgress';
import AddressIcon from '@/components/AddressIcon';
import useConfig from '@/hooks/useConfig';
import { RecoveryContainer } from '@/pages/recover';
import VerifyEmailGuardianModal from '@/pages/recover/VerifyEmailModal';
import { useSettingStore } from '@/store/setting';

export default function GuardianApprovals() {
  const { recoverInfo } = useTempStore();
  const { chainConfig } = useConfig();
  const { guardianAddressEmail } = useSettingStore();
  const { recoveryID, guardian_info, recoveryRecord } = recoverInfo;
  const hasRecord = recoveryRecord && recoveryID;
  const guardianSignatures = hasRecord ? recoveryRecord.guardianSignatures : [];
  const threshold = hasRecord ? recoveryRecord.guardian_info.threshold : 0;
  const [activeGuardianEmail, setActiveGuardianEmail] = useState('');
  const [activeGuardianAddress, setActiveGuardianAddress] = useState('');
  const pendingNum = threshold - (guardianSignatures || []).length;

  const { doCopy } = useTools();
  const guardianSignUrl = `${location.origin}/public/sign/${recoveryID}`;

  const openScan = (address: string) => {
    window.open(`${chainConfig.scanUrl}/address/${address}`, '_blank');
  };

  const signatures = hasRecord
    ? (guardian_info.guardians || []).map((item: any) => {
        const isValid = (guardianSignatures || []).filter((sig: any) => sig.guardian === item).length === 1;
        const email = guardianAddressEmail[item] || '';
        return { guardian: item, isValid, email };
      })
    : [];

  // const validNum = (!!signatures && !!signatures.length && signatures.filter((item: any) => !item.isValid).length)

  return (
    <RecoveryContainer>
      <Box
        padding="20px"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        minHeight="calc(100% - 58px)"
        width="100%"
        paddingTop="60px"
        flexDirection={{ base: 'column', md: 'row' }}
        marginTop="33px"
      >
        <RoundContainer
          width="1058px"
          maxWidth="100%"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          background="white"
          marginBottom="20px"
        >
          <Box
            width="100%"
            height="100%"
            padding={{ base: '20px', md: '50px' }}
            display="flex"
            alignItems="flex-start"
            justifyContent="center"
            flexDirection="column"
          >
            <Heading marginBottom="18px" type="h4" fontSize={{ base: '20px', md: '24px' }} fontWeight="700">
              Step 3/4: Guardian signature request
            </Heading>
            <TextBody fontWeight="600" maxWidth="635px" marginBottom="20px">
              Share this link with your guardians to sign:
            </TextBody>
            <Box
              wordBreak={'break-all'}
              marginBottom="10px"
              background="#F9F9F9"
              borderRadius="12px"
              padding="12px"
              fontSize="18px"
              fontWeight="700"
            >
              {guardianSignUrl}
            </Box>
            <Box width="100%" display="flex" alignItems="center" justifyContent="flex-start">
              <Button width="275px" maxWidth="100%" onClick={() => doCopy(guardianSignUrl)} size="xl">
                Share link with guardians
              </Button>
            </Box>
            <Box width="100%" marginTop="40px" marginBottom="40px">
              <Box width="100%" height="1px" background="rgba(0, 0, 0, 0.10)" />
            </Box>

            <Box color="black" fontFamily="Nunito" fontSize="18px" fontWeight="800" marginBottom="16px">
              {pendingNum || 0} more guardians approval needed
            </Box>
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-start"
              flexWrap="wrap"
              width={{ base: '100%', md: '100%' }}
            >
              {signatures.map((item: any, index: number) => {
                return item.email ? (
                  <Box>
                    <Box
                      border="1px solid rgba(0, 0, 0, 0.10)"
                      borderRadius="12px"
                      padding="14px"
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-start"
                      minWidth={{ base: '0', md: '400px' }}
                      marginRight={{ base: '0', md: '20px' }}
                      marginBottom="14px"
                      gap="8px"
                      width={{ base: '100%', md: 'auto' }}
                    >
                      <Box width="32px" height="32px" borderRadius="32px" background="#D9D9D9"></Box>
                      <Box fontSize="14px" fontWeight="700" fontFamily="Nunito" display="flex">
                        <Box>{item.email}</Box>
                      </Box>
                      {item.isValid ? (
                        <Box fontSize="14px" fontWeight="700" fontFamily="Nunito" color="#1CD20F" marginLeft="auto">
                          Signed
                        </Box>
                      ) : (
                        <Box
                          fontSize="14px"
                          fontWeight="700"
                          fontFamily="Nunito"
                          color="#848488"
                          marginLeft={{ base: '0', md: 'auto' }}
                        >
                          <Button
                            size="mid"
                            onClick={() => {
                              setActiveGuardianEmail(item.email);
                              setActiveGuardianAddress(item.guardian);
                            }}
                          >
                            Verify Email
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Box
                    key={index}
                    border="1px solid rgba(0, 0, 0, 0.10)"
                    borderRadius="12px"
                    padding="14px"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    minWidth={{ base: '0', md: '400px' }}
                    marginRight={{ base: '0', md: '20px' }}
                    marginBottom="14px"
                    gap="8px"
                    width={{ base: '100%', md: 'auto' }}
                  >
                    <AddressIcon address={item.guardian} width={32} />
                    <Box fontSize="14px" fontWeight="700" fontFamily="Nunito" display="flex">
                      <Box>{toShortAddress(item.guardian)}</Box>
                      <Box height="100%" display="flex" alignItems="center" justifyContent="center" padding="0 10px">
                        <Tooltip label="Copy address">
                          <Box cursor="pointer" marginRight="4px" onClick={() => doCopy(item.guardian)}>
                            <CopyIcon color="#898989" />
                          </Box>
                        </Tooltip>
                        <Tooltip label="View on explorer">
                          <Box cursor="pointer" onClick={() => openScan(item.guardian)}>
                            <OpenScanIcon />
                          </Box>
                        </Tooltip>
                      </Box>
                    </Box>
                    {item.isValid && (
                      <Box fontSize="14px" fontWeight="700" fontFamily="Nunito" color="#1CD20F" marginLeft="auto">
                        Signed
                      </Box>
                    )}
                    {!item.isValid && (
                      <Box
                        fontSize="14px"
                        fontWeight="700"
                        fontFamily="Nunito"
                        color="#848488"
                        marginLeft={{ base: '0', md: 'auto' }}
                      >
                        Waiting
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
          <VerifyEmailGuardianModal
            recoveryId={recoveryID}
            guardianEmail={activeGuardianEmail}
            guardianAddress={activeGuardianAddress}
            isOpen={activeGuardianEmail}
            onClose={() => {
              setActiveGuardianEmail('');
              setActiveGuardianAddress('');
            }}
          />
        </RoundContainer>
        <StepProgress activeIndex={2} />
      </Box>
    </RecoveryContainer>
  );
}
