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
  ModalBody,
  Tooltip,
} from '@chakra-ui/react';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import Button from '@/components/Button';
import BN from 'bignumber.js';
import TextBody from '@/components/new/TextBody';
import VideoIcon from '@/components/Icons/Video';
import TokenEmptyIcon from '@/assets/icons/token-empty.svg';
import ActivityEmptyIcon from '@/assets/icons/activity-empty.svg';
import QrcodeIcon from '@/components/Icons/Qrcode';
import { useAddressStore } from '@/store/address';
import useTools from '@/hooks/useTools';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useBalanceStore } from '@/store/balance';
import { ZeroAddress } from 'ethers';
import useConfig from '@/hooks/useConfig';
import useBrowser from '@/hooks/useBrowser';

const ActiveWalletModal = (_: unknown, ref: Ref<any>) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [promiseInfo, setPromiseInfo] = useState<any>({});
  const { navigate } = useBrowser();

  const { selectedAddress, setActivated } = useAddressStore();
  const { generateQrCode, doCopy } = useTools();
  const { showSignTransaction } = useWalletContext();
  const { selectedAddressItem, chainConfig } = useConfig();
  const [imgSrc, setImgSrc] = useState<string>('');
  const { getTokenBalance } = useBalanceStore();

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

  const doActivate = async () => {
    await showSignTransaction([]);
    setActivated(selectedAddress, true);
    onClose();
  };

  const generateQR = async (text: string) => {
    try {
      setImgSrc(await generateQrCode(text));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!selectedAddress) {
      return;
    }
    generateQR(selectedAddress);
  }, [selectedAddress]);

  const userDeposited = BN(getTokenBalance(ZeroAddress).tokenBalance).isGreaterThan(0);
  const userActivated = selectedAddressItem ? selectedAddressItem.activated : false;

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
            <Box height="100%" roundedBottom="20px" display="flex">
              <Box width="100%">
                <Box width="100%" display="flex" flexWrap="wrap">
                  <Box
                    display="flex"
                    alignItems="center"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    borderRadius="12px"
                    padding="35px 39px"
                    marginBottom="24px"
                    width="100%"
                    // cursor="pointer"
                    position="relative"
                    overflow="hidden"
                    boxSizing="border-box"
                    flexDirection={{ base: 'column', md: 'row' }}
                  >
                    {userDeposited ? (
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
                    ) : (
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
                    )}
                    <Box
                      width="80px"
                      height="80px"
                      borderRadius="80px"
                      marginRight="12px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      background="rgba(0, 0, 0, 0.05)"
                    >
                      <Image src={TokenEmptyIcon} width="80px" height="80px" />
                    </Box>
                    <Box width={{ base: '100%', md: 'calc(100% - 92px)' }}>
                      <TextBody fontSize="20px">Step 1: Deposit ETH</TextBody>
                      <Box
                        display="flex"
                        flexDirection={{ base: 'column', md: 'row' }}
                        marginTop={{ base: '20px', md: '4px' }}
                      >
                        <Box
                          background="#F1F1F1"
                          padding="0px 12px 0px 12px"
                          borderRadius="4px"
                          minHeight="28px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          marginBottom={{ base: '20px', md: '0' }}
                          marginRight={{ base: '0', md: 'auto' }}
                          width={{ base: '100%', md: 'max-content' }}
                        >
                          <TextBody type="t3" fontWeight="500" lineHeight="18px" width="100%">
                            <Box as="span" fontWeight="700">
                              {chainConfig.addressPrefix}
                            </Box>{' '}
                            {selectedAddress}
                          </TextBody>
                        </Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="flex-start"
                          width={{ base: '100%', md: '180px' }}
                          flexDirection={{ base: 'column', md: 'row' }}
                        >
                          <Box width={{ base: '100%', md: 'max-content' }}>
                            <Button
                              size="sm"
                              height="28px"
                              onClick={() => doCopy(selectedAddress)}
                              width={{ base: '100%', md: '104px' }}
                              marginBottom={{ base: '20px', md: '0' }}
                            >
                              Copy address
                            </Button>
                          </Box>
                          <Box marginLeft={{ base: '0', md: '8px' }} width={{ base: '100%', md: 'max-content' }}>
                            <Tooltip
                              label={
                                <Box>
                                  <Image src={imgSrc} mx="auto" display={'block'} w="106px" mb="2" />
                                </Box>
                              }
                              placement="top"
                              background="white"
                              boxShadow="none"
                              border="1px solid rgba(0, 0, 0, 0.1)"
                              width="138px"
                              height="138px"
                              padding="16px"
                            >
                              <Box>
                                <Button size="sm" height="28px" type="white" width={{ base: '100%', md: 'auto' }}>
                                  <QrcodeIcon />
                                </Button>
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    borderRadius="12px"
                    padding="35px 39px"
                    marginBottom="14px"
                    width="100%"
                    // cursor="pointer"
                    position="relative"
                    overflow="hidden"
                    boxSizing="border-box"
                    flexDirection={{ base: 'column', md: 'row' }}
                  >
                    {userActivated ? (
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
                    ) : (
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
                    )}
                    <Box
                      width="80px"
                      height="80px"
                      borderRadius="80px"
                      marginRight="12px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      background="rgba(0, 0, 0, 0.05)"
                    >
                      <Image src={ActivityEmptyIcon} width="80px" height="80px" />
                    </Box>
                    <Box width={{ base: '100%', md: 'calc(100% - 92px)' }}>
                      <TextBody fontSize="20px" display="flex" alignItems="center">
                        <Box>Step 2: Active wallet</Box>
                      </TextBody>
                      <Box
                        display="flex"
                        flexDirection={{ base: 'column', md: 'row' }}
                        marginTop={{ base: '20px', md: '4px' }}
                      >
                        <Box
                          minHeight="28px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          marginBottom={{ base: '20px', md: '0' }}
                          marginRight="auto"
                        >
                          <TextBody type="t3">{`The activation fee will be covered by Soul Wallet. $0 cost on you.`}</TextBody>
                        </Box>
                        <Box width={{ base: '100%', md: '180px' }}>
                          <Button
                            size="sm"
                            disabled={!userDeposited || userActivated}
                            height="28px"
                            onClick={doActivate}
                            width={{ base: '100%', md: '104px' }}
                          >
                            Active now
                          </Button>
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
