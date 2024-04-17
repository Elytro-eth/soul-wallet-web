import { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import {
  useToast,
  Text,
  Box,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import Button from '@/components/Button'
import TextBody from '@/components/new/TextBody'
import VideoIcon from '@/components/Icons/Video'
import TokenEmptyIcon from '@/assets/icons/token-empty.svg'
import ActivityEmptyIcon from '@/assets/icons/activity-empty.svg'
import QrcodeIcon from '@/components/Icons/Qrcode'

const ActiveWalletModal = (_: unknown, ref: Ref<any>) => {
  const [isSkipOpen, setIsSkipOpen] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [promiseInfo, setPromiseInfo] = useState<any>({});

  useImperativeHandle(ref, () => ({
    async show() {
      setVisible(true);
      return new Promise((resolve, reject) => {
        setPromiseInfo({
          resolve,
          reject,
        });
      });
    },
  }));

  const onClose = async () => {
    setVisible(false);
    promiseInfo.reject('User close');
  };

  return (
    <div ref={ref}>
      <Modal isOpen={visible} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="840px" borderRadius="20px">
          <ModalHeader
            display="flex"
            justifyContent="flex-start"
            gap="5"
            fontWeight="800"
            textAlign="center"
            padding="20px 32px"
          >
            Active wallet
          </ModalHeader>
          <ModalCloseButton top="14px" />
          <ModalBody overflow="auto" padding="20px 32px">
            <Box
              height="100%"
              roundedBottom="20px"
              display="flex"
            >
              <Box width="100%">
                <Box width="100%" display="flex" flexWrap="wrap">
                  <Box
                    display="flex"
                    alignItems="center"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    borderRadius="12px"
                    padding="16px"
                    marginBottom="24px"
                    width="100%"
                    cursor="pointer"
                    onClick={() => {}}
                    position="relative"
                  >
                    {true ? (
                      <Box
                        position="absolute"
                        top="0"
                        right="0"
                        background="#F1F1F1"
                        borderRadius="4px"
                        padding="4px 8px 4px 8px"
                        fontSize="10px"
                        color="#4E4E4E"
                      >
                        Uncompleted
                      </Box>
                    ) : (
                      <Box
                        position="absolute"
                        top="0"
                        right="0"
                        background="#F3FBF2"
                        borderRadius="4px"
                        padding="4px 8px 4px 8px"
                        fontSize="10px"
                        color="#0CB700"
                      >
                        Completed
                      </Box>
                    )}
                    <Box
                      width="60px"
                      height="60px"
                      borderRadius="60px"
                      marginRight="12px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      background="rgba(0, 0, 0, 0.05)"
                    >
                      <Image
                        src={TokenEmptyIcon}
                        width="60px"
                        height="60px"
                      />
                    </Box>
                    <Box>
                      <TextBody fontSize="20px">Step 1: Deposit ETH</TextBody>
                      <Box
                        display="flex"
                        marginTop="4px"
                      >
                        <Box
                          background="#F1F1F1"
                          padding="0px 12px 0px 12px"
                          borderRadius="4px"
                          minHeight="28px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <TextBody
                            type="t3"
                            fontWeight="500"
                            lineHeight="18px"
                          >
                            <Box as="span" fontWeight="700">ETH address:</Box> 0xFDF7AC7Be34f2882734b1e6A8f39656D6B14691C
                          </TextBody>
                        </Box>
                        <Box marginLeft="8px">
                          <Button size="sm" height="28px">Copy address</Button>
                        </Box>
                        <Box marginLeft="8px">
                          <Button size="sm" height="28px" type="white">
                            <QrcodeIcon />
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    borderRadius="12px"
                    padding="16px"
                    marginBottom="14px"
                    width="100%"
                    cursor="pointer"
                    position="relative"
                  >
                    {true ? (
                      <Box
                        position="absolute"
                        top="0"
                        right="0"
                        background="#F1F1F1"
                        borderRadius="4px"
                        padding="4px 8px 4px 8px"
                        fontSize="10px"
                        color="#4E4E4E"
                      >
                        Uncompleted
                      </Box>
                    ) : (
                      <Box
                        position="absolute"
                        top="0"
                        right="0"
                        background="#F3FBF2"
                        borderRadius="4px"
                        padding="4px 8px 4px 8px"
                        fontSize="10px"
                        color="#0CB700"
                      >
                        Completed
                      </Box>
                    )}
                    <Box
                      width="60px"
                      height="60px"
                      borderRadius="60px"
                      marginRight="12px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      background="rgba(0, 0, 0, 0.05)"
                    >
                      <Image
                        src={ActivityEmptyIcon}
                        width="60px"
                        height="60px"
                      />
                    </Box>
                    <Box>
                      <TextBody fontSize="20px" display="flex" alignItems="center">
                        <Box>Step 2: Active wallet</Box>
                      </TextBody>
                      <Box
                        display="flex"
                      >
                        <Box
                          minHeight="28px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <TextBody type="t3">{`The activation fee will be covered by Soul Wallet. $0 cost on you.`}</TextBody>
                        </Box>
                        <Box marginLeft="63px">
                          <Button size="sm" height="28px" disabled={true}>Active now</Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default forwardRef(ActiveWalletModal);
