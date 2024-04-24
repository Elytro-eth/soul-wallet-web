import { Flex, Box, Text, useToast, Image, Divider, Tooltip, useMediaQuery, usePanGesture } from '@chakra-ui/react';
import GasSelect from '../../SendAssets/comp/GasSelect';
import IconCopy from '@/assets/copy.svg';
import Button from '../../Button';
import { InfoWrap, InfoItem } from '@/components/SignTransactionModal';
import BN from 'bignumber.js';
import { toFixed, toShortAddress } from '@/lib/tools';
import useConfig from '@/hooks/useConfig';
import { useState, useEffect, useCallback, Fragment } from 'react';
import IconArrowDown from '@/assets/icons/arrow-down.svg';
import SignerSelect from '@/components/SignerSelect';
import IconQuestion from '@/assets/icons/question.svg';
import useQuery from '@/hooks/useQuery';
import { decodeCalldata } from '@/lib/tools';
import { useChainStore } from '@/store/chain';
import IconChevronDown from '@/assets/icons/chevron-down-gray.svg';
import IconZoom from '@/assets/icons/zoom.svg';
import IconLoading from '@/assets/loading.svg';
import api from '@/lib/api';
import { ethers } from 'ethers';
import { useBalanceStore } from '@/store/balance';
import { SignkeyType, UserOpUtils, UserOperation } from '@soulwallet/sdk';
import useTransaction from '@/hooks/useTransaction';
import useWalletContext from '@/context/hooks/useWalletContext';
import useWallet from '@/hooks/useWallet';
import { useAddressStore } from '@/store/address';
import { useSettingStore } from '@/store/setting';
import { useSlotStore } from '@/store/slot';
import { bundlerErrMapping } from '@/config';
import DropdownSelect from '@/components/DropdownSelect';
import AddressIcon from '@/components/AddressIcon';
import { useSignerStore } from '@/store/signer';
import ConnectWalletModal from '@/pages/recover/ConnectWalletModal';
// import useWagmi from '@/hooks/useWagmi';

export const LabelItem = ({ label, tooltip, chainName }: { label: string; tooltip?: string; chainName?: string }) => {
  return (
    <Flex gap="1" align={'center'}>
      <Text lineHeight={'1'}>{label}</Text>
      {tooltip && (
        <Tooltip label={tooltip}>
          <Image src={IconQuestion} w="18px" h="18px" />
        </Tooltip>
      )}
      {chainName && (
        <>
          <Text>·</Text>
          <Box py="1" px="2" color="brand.black" rounded="full" lineHeight={'1'} bg="#f9f9f9">
            {chainName}
          </Box>
        </>
      )}
    </Flex>
  );
};

export default function SignTransaction({ onSuccess, txns, sendToAddress, guardianInfo }: any) {
  const toast = useToast();
  const [loadingFee, setLoadingFee] = useState(true);
  const [promiseInfo, setPromiseInfo] = useState<any>({});
  const [decodedData, setDecodedData] = useState<any>({});
  const [isLargerThan992] = useMediaQuery('(min-width: 992px)');
  const [signing, setSigning] = useState<boolean>(false);
  const { ethersProvider, checkActivated, } = useWalletContext();
  const { getTokenBalance } = useBalanceStore();
  const [prechecked, setPrechecked] = useState(false);
  const { getSelectedKeyType } = useSignerStore();
  const [totalMsgValue, setTotalMsgValue] = useState('');
  const [payToken, setPayToken] = useState(ethers.ZeroAddress);
  const [payTokenSymbol, setPayTokenSymbol] = useState('');
  const [balanceEnough, setBalanceEnough] = useState(true);
  const [requiredAmount, setRequiredAmount] = useState('');
  const [activeOperation, setActiveOperation] = useState<UserOperation>();
  const [sponsor, setSponsor] = useState<any>(null);
  const { selectedChainId } = useChainStore();
  const { selectedAddress } = useAddressStore();
  const { setFinishedSteps } = useSettingStore();
  const { slotInfo } = useSlotStore();
  const [useSponsor, setUseSponsor] = useState(true);
  const { getPrefund } = useQuery();
  const { chainConfig, selectedAddressItem, selectedChainItem } = useConfig();
  const { signAndSend, getActivateOp, getUserOp, } = useWallet();

  const [userOpFormatted, setUserOpFormatted] = useState('');
  const selectedToken = getTokenBalance(payToken);
  const [hintText, setHintText] = useState('');
  const selectedTokenBalance = BN(selectedToken.tokenBalance).shiftedBy(-selectedToken.decimals).toFixed();
  const selectedTokenPrice = selectedToken.tokenPrice;
  const [showMore, setShowMore] = useState(false);
  // const { connectEOA, isConnected, isConnectOpen, openConnect, closeConnect } = useWagmi();

  // const checkSponser = async (userOp: UserOperation) => {
  //   // IMPORTANT TODO, simulate signature
  //   userOp.signature =
  //     '0xaf2a5bcc4c10b5289946daaa87caa467f3abadcc0000006201000065f2af9f000065f2bdaf0000000000000000000000000000000000000000a1da5b66f8c211583e706136bee9ab6f1ff43878b885620a8a16b0af5d52cf2c29ffdaf22944306a12f06fdcc41f11ff0f964160ce1f35140d039000301c345d1b';
  //   try {
  //     const res = await api.sponsor.check(
  //       selectedChainId,
  //       chainConfig.contracts.entryPoint,
  //       UserOpUtils.userOperationFromJSON(UserOpUtils.userOperationToJSON(userOp)),
  //     );
  //     if (res.data && res.data.paymasterData) {
  //       // TODO, check >1 sponsor
  //       setSponsor(res.data);
  //     }
  //   } catch (err) {
  //     setUseSponsor(false);
  //   }
  // };

  const clearState = () => {
    setPromiseInfo({});
    setDecodedData({});
    setLoadingFee(true);
    setSigning(false);
    setPayToken(ethers.ZeroAddress);
    setPayTokenSymbol('');
    setRequiredAmount('');
    setActiveOperation(undefined);
    setSponsor(null);
    setUseSponsor(true);
  };

  const onConfirm = async () => {
    try {
      setSigning(true);
      let userOp: any;
      if (sponsor && useSponsor && sponsor.paymasterData) {
        userOp = { ...activeOperation, paymasterData: sponsor.paymasterData };
      } else {
        userOp = activeOperation;
      }

      const receipt = await signAndSend(userOp);

      toast({
        title: 'Transaction success.',
        status: 'success',
      });

      onSuccess(receipt);

      markupStep();

      clearState();
    } catch (err) {
      console.log('sign page failed', err);
      toast({
        title: 'Transaction failed.',
        status: 'error',
      });
    } finally {
      setSigning(false);
    }
  };

  const markupStep = async () => {
    const safeUrl = location.href;

    let steps: number[] = [];

    if (safeUrl.includes('app.uniswap.org')) {
      steps = [3];
    }
    if (safeUrl.includes('staging.aave.com')) {
      steps = [4];
    }
  };

  const getFinalPrefund = async (userOp: any, payTokenAddress: string) => {
    setLoadingFee(true);
    console.log('get final prefund payToken', payTokenAddress);
    // TODO, extract this for other functions
    const { requiredAmount } = await getPrefund(userOp, payTokenAddress);

    setRequiredAmount(requiredAmount);

    setLoadingFee(false);
  };

  const getFinalUserOp = async (txns: any, payTokenAddress: string) => {
    try {
      // IMPORTANT TODO
      const isActivated = await checkActivated();
      if (isActivated) {
        // if activated, get userOp directly
        return await getUserOp(txns, payTokenAddress);
      } else {
        // if not activated, prepend activate txns
        return await getActivateOp();
      }
    } catch (err: any) {
      console.log('Get final userOp err:', err.message);
      throw new Error(err.message);
    }
  };

  const doPrecheck = async (payTokenAddress: string, force: boolean = false) => {
    if (prechecked && !force) {
      return;
    }
    console.log('trigger pre check', payTokenAddress);
    try {
      setPrechecked(true);
      setLoadingFee(true);
      setRequiredAmount('');
      setTotalMsgValue(
        txns
          .reduce((total: any, current: any) => total.plus(current.value || 0), BN(0))
          .shiftedBy(-18)
          .toFixed(),
      );
      setPayTokenSymbol(getTokenBalance(payTokenAddress).symbol || 'Unknown');

      let userOp = await getFinalUserOp(txns, payTokenAddress);
      setActiveOperation(userOp);
      const callDataDecodes = await decodeCalldata(
        selectedChainId,
        chainConfig.contracts.entryPoint,
        userOp,
        ethersProvider,
      );
      console.log('decoded data', callDataDecodes);
      setDecodedData(callDataDecodes);
      // checkSponser(userOp);
      getFinalPrefund(userOp, payTokenAddress);
      setUserOpFormatted(userOp);
      if (payTokenAddress === ethers.ZeroAddress) {
        // ETH is not enough
        if (BN(totalMsgValue).isGreaterThanOrEqualTo(selectedTokenBalance)) {
          console.log('Not enough balance!');
        }
      } else {
        // ERC20 is not enough
        // TODO, check erc20 send amount in user op
      }
    } catch (err: any) {
      const errMessage: any = err.message;
      const descMessage = bundlerErrMapping[errMessage];
      setHintText(`${errMessage}${descMessage ? ', ' + descMessage : ''}`);
      toast({
        title: errMessage,
        description: descMessage,
        status: 'error',
        duration: 5000,
      });
      // setHintText(err);
    } finally {
      // setLoadingFee(false);
    }
  };

  const onPayTokenChange = (val: string, isSponsor: boolean) => {
    setPayToken(val);
    doPrecheck(val, true);
    setUseSponsor(isSponsor);
  };

  const onSignerChange = () => {
    doPrecheck(payToken, true);
  };

  // IMPORTANT IMPORTANT TODO, rendered twice
  useEffect(() => {
    if (!payToken) {
      return;
    }
    console.log('do pre check', txns, payToken);
    doPrecheck(payToken);
  }, [txns, payToken]);

  console.log('guardianInfo sign', guardianInfo)
  useEffect(() => {
    if (!requiredAmount || !payToken || (sponsor && useSponsor)) {
      return;
    }

    const token = getTokenBalance(payToken);

    if (payToken === ethers.ZeroAddress) {
      setBalanceEnough(BN(token.tokenBalanceFormatted).minus(totalMsgValue).isGreaterThanOrEqualTo(requiredAmount));
    } else {
      // todo, should minus sendErc20 token balance as well
      setBalanceEnough(BN(token.tokenBalanceFormatted).isGreaterThanOrEqualTo(requiredAmount));
    }
  }, [requiredAmount, payToken, sponsor, useSponsor]);


  return (
    <Box pb={{ base: 6, lg: 0 }}>
      <Flex flexDir={'column'}>
        {!!guardianInfo && (
          <Box
            background="#F9F9F9"
            borderRadius="20px"
            padding="20px 16px 20px 16px"
          >
            <Box
              borderBottom="1px solid #DCDCDC"
              paddingBottom="16px"
              fontSize="14px"
              fontWeight="500"
            >
              Per your settings, <Box as="span" fontWeight="700">{guardianInfo.threshold}</Box> of the <Box as="span" fontWeight="700">{guardianInfo.guardians.length}</Box> guardian’s approve is required for recovery.
            </Box>
            <Box
              paddingTop="16px"
            >
              {guardianInfo.guardians.map((item: any, i: any) =>
                <Box
                  marginBottom="14px"
                >
                  <Box fontWeight="800" fontSize="14px" marginBottom="6px">Guardian {i + 1}: {guardianInfo.guardianNames[i] || 'no name'}</Box>
                  <Box fontSize="14px">{item}</Box>
                </Box>
              )}
            </Box>
          </Box>
        )}
        {!guardianInfo && (
          <Fragment>
            <Flex flexDir={'column'} align={'center'} lineHeight={'1'}>
              {decodedData && (
                <Flex flexDir={'column'} align={'center'} fontSize={'20px'} fontWeight={'800'}>
                  {decodedData.length > 0 ? decodedData.map((item: any, index: number) => (
                    <Tooltip key={index} label={item.to ? `To: ${item.to}` : null}>
                      <Text my="1" textTransform="capitalize" key={index}>
                        {item.functionName ? item.functionName : item.method ? item.method.name : 'Unknown'}
                        {item.sendErc20Amount && ` ${toFixed(item.sendErc20Amount, 6)}`}
                      </Text>
                    </Tooltip>
                  )) : 'Send transaction'}
                </Flex>
              )}
              {totalMsgValue && Number(totalMsgValue) > 0 && (
                <>
                  <Text mt="7" fontSize={{ base: '20px', md: '24px', lg: '30px' }} mb="3" fontWeight={'700'}>
                    {toFixed(totalMsgValue, 6)} ETH
                  </Text>
                  {totalMsgValue && selectedTokenPrice && (
                    <Text fontWeight={'600'} mb="4">
                      ≈${toFixed(BN(totalMsgValue).times(selectedTokenPrice).toString(), 2)}
                    </Text>
                  )}
                </>
              )}
            </Flex>
            <Image src={IconArrowDown} mb="1" w="8" mx="auto" />
            <Box mb="1" w="300px" mx="auto" textAlign={'center'}>
              {sendToAddress && (
                <Flex
                  py="3"
                  mb="2px"
                  bg="#F9F9F9"
                  roundedTop="20px"
                  fontSize={'18px'}
                  align={'center'}
                  justify={'center'}
                  gap="2"
                  fontWeight={'700'}
                >
                  <AddressIcon address={sendToAddress} width={32} />
                  {toShortAddress(sendToAddress)}
                </Flex>
              )}
              <Box py="1" bg="#F9F9F9" color="#818181" fontSize={'14px'} roundedBottom={'20px'}>
                From {selectedChainItem.addressPrefix}
                {toShortAddress(selectedAddress)}
              </Box>
            </Box>
          </Fragment>
        )}
        {/** Only show when interact with dapp */}

        {/* <Box textAlign={'center'} mb="9">
            <Tooltip
            color="brand.green"
            bg="#EFFFEE"
            label={
            <Flex gap="2" align={'center'}>
            <Image src={IconChecked} w="8" />
            <Text color="brand.green" fontSize={'14px'} fontWeight={'600'}>
            Low risk: This dapp is listed by 3 and more communities.
            </Text>
            </Flex>
            }
            >
            <Flex
            cursor={'default'}
            gap="6px"
            align={'center'}
            bg="#EFFFEE"
            py="1"
            px="2"
            rounded="full"
            display={'inline-flex'}
            >
            <Image src={IconChecked} w="4" />
            <Text color="brand.green" fontSize={'14px'} fontWeight={'600'}>
            Low risk
            </Text>
            </Flex>
            </Tooltip>
            </Box> */}

        {/* <Box mt="4" mb="4" h="1px" bg="rgba(0, 0, 0, 0.10)" /> */}

        <Box mt="4" mb="5">
          <Flex gap="6" align={'center'}>
            <Box w="100%" h="1px" bg="rgba(0, 0, 0, 0.10)" />
            <Flex
              gap="1"
              align={'center'}
              onClick={() => setShowMore((prev) => !prev)}
              cursor={'pointer'}
              whiteSpace={'nowrap'}
            >
              <Text userSelect={'none'} color="#818181" fontSize={'14px'}>
                Show {showMore ? 'less' : 'more'}
              </Text>
              <Image src={IconChevronDown} transform={showMore ? 'rotate(180deg)' : ''} />
            </Flex>
            <Box w="100%" h="1px" bg="rgba(0, 0, 0, 0.10)" />
          </Flex>
        </Box>

        {showMore && (
          <>
            <Box rounded="20px" mb="5" bg="#F9F9F9" p="4">
              <Flex align={'center'} gap="1" mb="4">
                <Image src={IconZoom} w="20px" h="20px" />
                <Text fontWeight={'800'}>User Operation</Text>
              </Flex>
              <Box h="160px" overflowY={'auto'}>
                {loadingFee ? (
                  <Box>Loading...</Box>
                ) : (
                  <pre>
                    <code>{JSON.stringify(userOpFormatted, null, 2)}</code>
                  </pre>
                )}
              </Box>
            </Box>
          </>
        )}

        <Flex flexDir={'column'} gap="3">
          <InfoWrap fontSize="14px">
            <InfoItem>
              <LabelItem
                label="Signer"
                tooltip={`A transaction signer is responsible for authorizing blockchain transactions, ensuring security and validity before they're processed on the network.`}
              />
              <Flex gap="2" fontWeight={'500'}>
                <SignerSelect onChange={onSignerChange} />
              </Flex>
            </InfoItem>
            <InfoItem>
              <LabelItem
                label="Gas"
                tooltip={`Gas fees are charges for transactions on blockchains, paying for computing efforts to process and secure activities. These fees fluctuate with network demand and transaction details.`}
                chainName={isLargerThan992 ? selectedChainItem.chainName : null}
              />
              <Flex gap="2" fontWeight={'500'} align={'center'}>
                {requiredAmount ? (
                  <>
                    <Text fontSize={'14px'} fontWeight={'600'}>
                      {toFixed(requiredAmount, 6)}
                    </Text>
                    <GasSelect
                      gasToken={payToken}
                      sponsor={sponsor}
                      useSponsor={useSponsor}
                      onChange={(val: string, isSponsor: boolean) => onPayTokenChange(val, isSponsor)}
                    />
                  </>
                ) : (
                  <Image src={IconLoading} />
                )}
              </Flex>
            </InfoItem>
            {sponsor && useSponsor && requiredAmount && (
              <InfoItem>
                <LabelItem
                  label="Sponsor"
                  tooltip={`A gas fee sponsor pays blockchain transaction costs for users, enhancing experience and encouraging app usage without fee concerns.`}
                />
                <Flex gap="2" align={'center'}>
                  <Text color="brand.red" fontSize={'14px'} fontWeight={'600'}>
                    -{BN(requiredAmount).toFormat(6)} ETH
                  </Text>
                  <DropdownSelect hideChevron>
                    <Text>Soul Wallet</Text>
                  </DropdownSelect>
                </Flex>
              </InfoItem>
            )}
            {/* <InfoItem color="#000" fontWeight="600">
                <Text>Total</Text>
                {totalMsgValue && Number(totalMsgValue) ? `${totalMsgValue} ETH` : ''}
                {totalMsgValue && Number(totalMsgValue) && !useSponsor && requiredAmount ? ' + ' : ''}
                {!useSponsor && requiredAmount ? `${BN(requiredAmount).toFixed(6) || '0'} ${payTokenSymbol}` : ''}
                {!useSponsor &&
                requiredAmount &&
                decodedData &&
                decodedData.length > 0 &&
                decodedData.filter((item: any) => item.sendErc20Amount).length > 0
                ? ' + '
                : ''}
                {decodedData &&
                decodedData.length > 0 &&
                decodedData
                .filter((item: any) => item.sendErc20Amount)
                .map((item: any) => item.sendErc20Amount)
                .join(' + ')}
                </InfoItem> */}
            {hintText && (
              <InfoItem>
                <Text color="#f00">{hintText}</Text>
              </InfoItem>
            )}
            {!balanceEnough && (!sponsor || !useSponsor) && (
              <InfoItem>
                <Text color="#f00">Not enough balance</Text>
              </InfoItem>
            )}
          </InfoWrap>
        </Flex>

        {/* {decodedData && decodedData.length > 1 && (
            <>
            <InfoWrap color="#646464" fontSize="12px" gap="3">
            {decodedData.map((item: any, idx: number) => (
            <InfoItem key={idx}>
            <Text>
            {item.functionName ? item.functionName : item.method ? item.method.name : 'Unknown'}{' '}
            {item.sendErc20Amount && ` ${item.sendErc20Amount}`}
            </Text>
            {item.to && (
            <Flex align={'center'} gap="1">
            <Text>{toShortAddress(item.to)}</Text>
            <Image src={IconCopy} onClick={() => doCopy(item.to)} cursor={'pointer'} opacity={0.5} />
            </Flex>
            )}
            </InfoItem>
            ))}
            </InfoWrap>
            <Divider borderColor={'#d7d7d7'} mb="3" />
            </>
            )} */}
      </Flex>
      <Box mt="10">
        {/* {!balanceEnough && (!sponsor || !useSponsor) && (
            <Text mb="2" color="danger" textAlign={'center'}>
            Balance not enough
            </Text>
            )} */}
        {/* {getSelectedKeyType() === SignkeyType.EOA && !isConnected ? (
            <Button
            w="320px"
            display={'flex'}
            gap="2"
            fontSize={'20px'}
            py="4"
            fontWeight={'800'}
            mx="auto"
            onClick={openConnect}
            >
            Connect Wallet
            </Button>
            ) : ( */}
        <Button
        w="320px"
        display={'flex'}
        gap="2"
        fontSize={'20px'}
        py="4"
        fontWeight={'800'}
        mx="auto"
        onClick={onConfirm}
        loading={signing}
        disabled={(loadingFee || !balanceEnough) && (!sponsor || !useSponsor)}
        >
        Confirm
        </Button>
        {/* )} */}
      </Box>
      {/* <ConnectWalletModal isOpen={isConnectOpen} connectEOA={connectEOA} onClose={closeConnect} /> */}
    </Box>
  );
}
