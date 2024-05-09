import { Box, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Input } from '@chakra-ui/react';
import TextBody from '@/components/new/TextBody';
import Title from '@/components/new/Title';
import Button from '@/components/Button';
import CopyIcon from '@/components/Icons/Copy';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '@/lib/api';
import useTools from '@/hooks/useTools';

export default function VerifyEmailGuardianModal({ guardianEmail, guardianAddress, recoveryId, isOpen, onClose }: any) {
  const [templateInfo, setTemplateInfo] = useState<any>({});
  const { doCopy } = useTools();

  const getEmailTemplate = async () => {
    const res = await api.emailGuardian.emailTemplate({
      email: guardianEmail,
      guardianAddress,
      recoveryID: recoveryId,
    });
    setTemplateInfo(res.data);
  };

  useEffect(() => {
    if (!guardianEmail || !guardianAddress || !recoveryId) {
      return;
    }
    getEmailTemplate();
    return () => {
      setTemplateInfo({});
    };
  }, [guardianEmail, guardianAddress, recoveryId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW={{ base: '95%', lg: '609px' }} my={{ base: '120px' }} borderRadius="20px">
        <ModalCloseButton top="14px" onClick={onClose} />
        <ModalBody
          overflow="auto"
          padding={{ base: '20px 10px', md: '20px 32px' }}
          marginTop={{ base: '30px', md: '30px' }}
        >
          <Box height="100%" roundedBottom="20px" display="flex">
            <Box width="100%" padding="0 20px">
              <Title fontSize="28px" fontWeight="700" textAlign="center" width="100%">
                Verify Email
              </Title>
              <TextBody fontSize="16px" fontWeight="400" marginTop="14px" marginBottom="31px" textAlign="center">
                Please go to your email and send the following content. This email will be used for approve your
                recovery request on chain.
              </TextBody>
              <Box width="100%" border="1px solid rgba(0, 0, 0, 0.05)" borderRadius="8px" overflow="hidden">
                <Box background="#F2F2F2" padding="10px 24px" fontSize="14px" fontWeight="800">
                  New Message
                </Box>
                <Box padding="10px 24px" fontSize="14px" display="flex" flexDirection="column" width="100%">
                  <Box width="100%" display="flex" alignItems="center" justifyContent="flex-start" marginBottom="18px">
                    <Box width="65px">From</Box>
                    <Box fontWeight="600">{templateInfo.from}</Box>
                  </Box>
                  <Box width="100%" display="flex" alignItems="center" justifyContent="flex-start" marginBottom="18px">
                    <Box width="65px">To</Box>
                    <Box fontWeight="600" display="flex" alignItems="center">
                      <Box>{templateInfo.to}</Box>
                      <Box
                        marginLeft="4px"
                        onClick={() => {
                          doCopy(templateInfo.to);
                        }}
                        cursor="pointer"
                        marginRight="4px"
                      >
                        <CopyIcon color="#898989" />
                      </Box>
                    </Box>
                  </Box>
                  <Box width="100%" height="1px" background="rgba(0, 0, 0, 0.05)" marginBottom="18px" />
                  <Box width="100%" display="flex" alignItems="flex-start" justifyContent="flex-start">
                    <Box width="65px" opacity="0.5">
                      Subject
                    </Box>
                    <Box width="calc(100% - 65px)" fontWeight="600" display="flex" alignItems="center">
                      <Box wordBreak={'break-all'}>{templateInfo.subject}</Box>
                      <Box marginLeft="4px" cursor="pointer" marginRight="4px"  onClick={() => doCopy(templateInfo.subject)}>
                        <CopyIcon color="#898989" />
                      </Box>
                    </Box>
                  </Box>

                  <Box mt="3" mb="2" width="100%" display="flex" alignItems="flex-start" justifyContent="flex-start">
                    <Box width="65px" opacity="0.5">
                      Body
                    </Box>
                    <Box width="calc(100% - 65px)" fontWeight="600" display="flex" alignItems="center">
                      <Box>{templateInfo.body}</Box>
                      <Box marginLeft="4px" cursor="pointer" marginRight="4px" onClick={() => doCopy(templateInfo.body)}>
                        <CopyIcon color="#898989" />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box width="100%" display="flex" alignItems="center" justifyContent="center" marginTop="24px">
                <Button size="lg">Send via default email app</Button>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
