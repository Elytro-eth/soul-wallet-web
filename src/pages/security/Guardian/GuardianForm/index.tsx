import React, { useState, useRef, useImperativeHandle, useCallback, useEffect, Fragment } from 'react';
import { Box, Text, Image, useToast, Select, Menu, MenuList, MenuButton, MenuItem, Tooltip } from '@chakra-ui/react';
import FullscreenContainer from '@/components/FullscreenContainer';
import ArrowRightIcon from '@/components/Icons/ArrowRight';
import Heading1 from '@/components/web/Heading1';
import Heading3 from '@/components/web/Heading3';
import TextBody from '@/components/web/TextBody';
import Button from '@/components/web/Button';
import TextButton from '@/components/web/TextButton';
import { ethers } from 'ethers';
import MinusIcon from '@/assets/icons/minus.svg';
import IconButton from '@/components/web/IconButton';
import SendIcon from '@/components/Icons/Send';
import FormInput from '@/components/web/Form/FormInput';
import DoubleFormInput from '@/components/web/Form/DoubleFormInput';
import useWallet from '@/hooks/useWallet';
import useForm from '@/hooks/useForm';
import BN from 'bignumber.js'
import Icon from '@/components/Icon';
import { nextRandomId } from '@/lib/tools';
import DropDownIcon from '@/components/Icons/DropDown';
import PlusIcon from '@/components/Icons/Plus';
import ArrowDownIcon from '@/components/Icons/ArrowDown';
import QuestionIcon from '@/components/Icons/Question';
import DownloadIcon from '@/components/Icons/Download';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useAddressStore } from '@/store/address';
import { nanoid } from 'nanoid';
import { useGuardianStore } from '@/store/guardian';
import useKeystore from '@/hooks/useKeystore';
import useConfig from '@/hooks/useConfig';
import { L1KeyStore } from '@soulwallet/sdk';
import useTransaction from '@/hooks/useTransaction';
import api from '@/lib/api';
import { useCredentialStore } from '@/store/credential';
import useTools from '@/hooks/useTools';
import ArrowLeftIcon from '@/components/Icons/ArrowLeft';
import GuardianModal from '../GuardianModal'
import DoubleCheckModal from '../DoubleCheckModal'

const defaultGuardianIds = [nextRandomId()];

const getNumberArray = (count: number) => {
  const arr = [];

  for (let i = 1; i <= count; i++) {
    arr.push(i);
  }

  return arr;
};

const toHex = (num: any) => {
  let hexStr = num.toString(16);

  if (hexStr.length % 2 === 1) {
    hexStr = '0' + hexStr;
  }

  hexStr = '0x' + hexStr;

  return hexStr;
};

const getRecommandCount = (c: number) => {
  if (!c) {
    return 0;
  }

  return Math.ceil(c / 2);
};

const getFieldsByGuardianIds = (ids: any) => {
  const fields = [];

  for (const id of ids) {
    const addressField = `address_${id}`;
    const nameField = `name_${id}`;
    fields.push(addressField);
    fields.push(nameField);
  }

  return fields;
};

const isENSAddress = (address: string) => {
  const ensRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
  return ensRegex.test(address);
};

const validate = (values: any) => {
  const errors: any = {};
  const addressKeys = Object.keys(values).filter((key) => key.indexOf('address') === 0);
  const nameKeys = Object.keys(values).filter((key) => key.indexOf('name') === 0);
  const existedAddress = [];

  for (const addressKey of addressKeys) {
    const address = values[addressKey];

    if (address && address.length && !ethers.isAddress(address)) {
      errors[addressKey] = 'Invalid Address';
    } else if (existedAddress.indexOf(address) !== -1) {
      errors[addressKey] = 'Duplicated Address';
    } else if (address && address.length) {
      existedAddress.push(address);
    }
  }

  return errors;
};

const amountValidate = (values: any, props: any) => {
  const errors: any = {};

  if (
    !values.amount ||
    !Number.isInteger(Number(values.amount)) ||
    Number(values.amount) < 1 ||
    Number(values.amount) > Number(props.guardiansCount)
  ) {
    errors.amount = 'Invalid Amount';
  }

  return errors;
};

const getDefaultGuardianIds = (count: number) => {
  const ids = [];

  for (let i = 0; i < count; i++) {
    ids.push(nextRandomId());
  }

  return ids;
};

const getInitialValues = (ids: string[], guardians: string[], guardianNames: string[]) => {
  const idCount = ids.length;
  const guardianCount = guardians.length;
  const count = idCount > guardianCount ? idCount : guardianCount;
  const values: any = {};

  for (let i = 0; i < count; i++) {
    if (ids[i]) {
      values[`address_${ids[i]}`] = guardians[i];
      values[`name_${ids[i]}`] = guardianNames[i];
    }
  }

  return values;
};

const isGuardiansListFilled = (list: any) => {
  if (!list.length) return false

  let isFilled = true

  for (const item of list) {
    isFilled = isFilled && item
  }

  return isFilled
}

export default function GuardianForm({ cancelEdit, startBackup }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { guardiansInfo, updateGuardiansInfo } = useGuardianStore();
  const guardianDetails = (guardiansInfo && guardiansInfo.guardianDetails) || {
    guardians: [],
    threshold: 0
  }
  const guardianNames = (guardiansInfo && guardiansInfo.guardianNames) || []
  const { setFinishedSteps } = useAddressStore();
  const defaultGuardianIds = getDefaultGuardianIds((guardianDetails.guardians && guardianDetails.guardians.length > 1 && guardianDetails.guardians.length) || 1)
  const [guardianIds, setGuardianIds] = useState(defaultGuardianIds);
  const [fields, setFields] = useState(getFieldsByGuardianIds(defaultGuardianIds));
  const [guardiansList, setGuardiansList] = useState([]);
  const [amountData, setAmountData] = useState<any>({});
  const { slotInfo, setGuardiansInfo, setEditingGuardiansInfo } = useGuardianStore();
  const { getReplaceGuardianInfo, calcGuardianHash, getSlot } = useKeystore();
  const { chainConfig } = useConfig();
  const [loading, setLoading] = useState(false);
  const { sendErc20, payTask } = useTransaction();
  const { showConfirmPayment } = useWalletContext();
  const { credentials } = useCredentialStore();
  const [showAdvance, setShowAdvance] = useState(false)
  const [keepPrivate, setKeepPrivate] = useState(!!guardiansInfo.keepPrivate)
  const [status, setStatus] = useState<string>('editing');
  const [isDone, setIsDone] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);
  const { generateJsonName, downloadJsonFile } = useTools()
  const toast = useToast();
  const emailForm = useForm({
    fields: ['email'],
    validate,
  });

  const { values, errors, invalid, onChange, onBlur, showErrors, addFields, removeFields } = useForm({
    fields,
    validate,
    initialValues: getInitialValues(defaultGuardianIds, guardianDetails.guardians, guardianNames)
  });

  const amountForm = useForm({
    fields: ['amount'],
    validate: amountValidate,
    restProps: amountData,
    initialValues: {
      amount: getRecommandCount(amountData.guardiansCount),
    },
  });

  const disabled = invalid || !guardiansList.length || amountForm.invalid || loading || !isGuardiansListFilled(guardiansList);

  useEffect(() => {
    setGuardiansList(
      Object.keys(values)
            .filter((key) => key.indexOf('address') === 0)
            .map((key) => values[key])
            // .filter((address) => !!String(address).trim().length) as any,
    );
  }, [values]);

  useEffect(() => {
    setAmountData({ guardiansCount: guardiansList.length });
  }, [guardiansList]);

  const handleSubmit = async () => {
    setIsConfirmOpen(false)
    if (disabled) return;

    try {
      setLoading(true);
      const guardiansList = guardianIds
        .map((id) => {
          const addressKey = `address_${id}`;
          const nameKey = `name_${id}`;
          let address = values[addressKey];

          if (address && address.length) {
            return { address, name: values[nameKey] };
          }

          return null;
        })
        .filter((i) => !!i);

      const guardianAddresses = guardiansList.map((item: any) => item.address);
      const guardianNames = guardiansList.map((item: any) => item.name);
      const threshold = amountForm.values.amount || 0;

      const newGuardianHash = calcGuardianHash(guardianAddresses, threshold);
      const keystore = chainConfig.contracts.l1Keystore;
      const salt = ethers.ZeroHash;
      const { initialKeys, initialGuardianHash, initialGuardianSafePeriod, slot } = slotInfo;
      const currentKeys = await Promise.all(credentials.map((credential: any) => credential.publicKey))
      const initalkeysAddress = L1KeyStore.initialKeysToAddress(initialKeys);
      const currentkeysAddress = L1KeyStore.initialKeysToAddress(currentKeys);
      console.log('initialKeys', initalkeysAddress, currentkeysAddress)
      let initalRawkeys
      if (initalkeysAddress.join('') === currentkeysAddress.join('')) {
        initalRawkeys = new ethers.AbiCoder().encode(["bytes32[]"], [initalkeysAddress]);
      } else {
        initalRawkeys = new ethers.AbiCoder().encode(["bytes32[]"], [currentkeysAddress]);
      }

      const initialKeyHash = L1KeyStore.getKeyHash(initalkeysAddress);

      const walletInfo = {
        keystore,
        slot,
        slotInfo: {
          initialKeyHash,
          initialGuardianHash,
          initialGuardianSafePeriod
        },
        keys: initalkeysAddress
      };

      const guardiansInfo = {
        keystore,
        slot,
        guardianHash: newGuardianHash,
        guardianNames,
        guardianDetails: {
          guardians: guardianAddresses,
          threshold: Number(threshold),
          salt,
        },
        requireBackup: true,
        keepPrivate
      };

      await api.guardian.backupGuardians(guardiansInfo);

      const { keySignature } = await getReplaceGuardianInfo(newGuardianHash)

      const functionName = `setGuardian(bytes32,bytes32,uint256,bytes32,bytes,bytes)`
      const parameters = [
        initialKeyHash,
        initialGuardianHash,
        initialGuardianSafePeriod,
        newGuardianHash,
        initalRawkeys,
        keySignature,
      ]

      const res1 = await api.guardian.createTask({
        keystore,
        functionName,
        parameters
      })

      const task = res1.data
      const paymentContractAddress = chainConfig.contracts.paymentContractAddress;
      const res2 = await showConfirmPayment(task.estiamtedFee);
      const res3 = await payTask(paymentContractAddress, task.estiamtedFee, task.taskID);
      console.log('handleSubmit1111', res1, res2, res3);
      // setGuardiansInfo(guardiansInfo)
      setEditingGuardiansInfo(guardiansInfo)
      cancelEdit()
      setLoading(false);
      const res = await api.operation.finishStep({
        slot,
        steps: [2],
      })
      setFinishedSteps(res.data.finishedSteps);
    } catch (error: any) {
      console.log('error', error.message)
      setLoading(false);
    }
  };

  useEffect(() => {
    const test = async () => {
      const result2 = await api.guardian.getTask({
        taskID: '0xfc1e5a082b9d06f4031108b18c160c730fde805e391e1a306474d2f370e61a63'
      })
      console.log('taskID', result2);
    }

    test()
  }, [])

  const addGuardian = () => {
    const id = nextRandomId();
    const newGuardianIds = [...guardianIds, id];
    const newFields = getFieldsByGuardianIds(newGuardianIds);
    setGuardianIds(newGuardianIds);
    setFields(newFields);
    addFields(getFieldsByGuardianIds([id]));
  };

  const removeGuardian = (deleteId: string) => {
    if (guardianIds.length > 1) {
      const newGuardianIds = guardianIds.filter((id) => id !== deleteId);
      const newFields = getFieldsByGuardianIds(newGuardianIds);
      setGuardianIds(newGuardianIds);
      setFields(newFields);
      removeFields(getFieldsByGuardianIds([deleteId]));
    }
  };

  const selectAmount = (amount: any) => () => {
    amountForm.onChange('amount')(amount);
  };

  useEffect(() => {
    if (!amountForm.values.amount || Number(amountForm.values.amount) > amountData.guardiansCount) {
      amountForm.onChange('amount')(getRecommandCount(amountData.guardiansCount));
    }
  }, [amountData.guardiansCount, amountForm.values.amount]);

  const hasGuardians = guardianDetails && guardianDetails.guardians && !!guardianDetails.guardians.length

  const handleEmailBackupGuardians = async () => {
    try {
      setSending(true);
      const keystore = chainConfig.contracts.l1Keystore;
      const slot = slotInfo.slot
      const guardiansList = guardianIds
        .map((id) => {
          const addressKey = `address_${id}`;
          const nameKey = `name_${id}`;
          let address = values[addressKey];

          if (address && address.length) {
            return { address, name: values[nameKey] };
          }

          return null;
        })
        .filter((i) => !!i);

      const guardianAddresses = guardiansList.map((item: any) => item.address);
      const guardianNames = guardiansList.map((item: any) => item.name);
      const threshold = amountForm.values.amount || 0;
      const guardianHash = calcGuardianHash(guardianAddresses, threshold);
      const salt = ethers.ZeroHash;

      const guardiansInfo = {
        keystore,
        slot,
        guardianHash,
        guardianNames,
        guardianDetails: {
          guardians: guardianAddresses,
          threshold,
          salt,
        },
        keepPrivate
      };

      const filename = generateJsonName('guardian');
      await api.guardian.emailBackupGuardians({
        email: emailForm.values.email,
        filename,
        ...guardiansInfo
      });
      setSending(false);
      emailForm.clearFields(['email'])
      setIsDone(true)
      updateGuardiansInfo({
        requireBackup: false
      })
      toast({
        title: 'Email Backup Success!',
        status: 'success',
      });
    } catch (e: any) {
      setSending(false);
      toast({
        title: e.message,
        status: 'error',
      });
    }
  }

  const handleDownloadGuardians = async () => {
    try {
      setDownloading(true);
      const keystore = chainConfig.contracts.l1Keystore;
      const slot = slotInfo.slot
      const guardiansList = guardianIds
        .map((id) => {
          const addressKey = `address_${id}`;
          const nameKey = `name_${id}`;
          let address = values[addressKey];

          if (address && address.length) {
            return { address, name: values[nameKey] };
          }

          return null;
        })
        .filter((i) => !!i);

      const guardianAddresses = guardiansList.map((item: any) => item.address);
      const guardianNames = guardiansList.map((item: any) => item.name);
      const threshold = amountForm.values.amount || 0;
      const guardianHash = calcGuardianHash(guardianAddresses, threshold);
      const salt = ethers.ZeroHash;

      const guardiansInfo = {
        keystore,
        slot,
        guardianHash,
        guardianNames,
        guardianDetails: {
          guardians: guardianAddresses,
          threshold,
          salt,
        },
        keepPrivate
      };

      await downloadJsonFile(guardiansInfo);
      setDownloading(false);
      setIsDone(true)
      updateGuardiansInfo({
        requireBackup: false
      })
      toast({
        title: 'Email Backup Success!',
        status: 'success',
      });
    } catch (e: any) {
      setDownloading(false);
      toast({
        title: e.message,
        status: 'error',
      });
    }
  }

  const goBack = () => {
    setStatus('editing');
  };

  if (status === 'backuping') {
    return (
      <Box width="100%" display="flex" alignItems="center" justifyContent="center">
        <Box width="320px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Box width="100%">
            <TextButton
              color="#1E1E1E"
              fontSize="16px"
              fontWeight="800"
              width="57px"
              padding="0"
              alignItems="center"
              justifyContent="center"
              onClick={goBack}
            >
              <ArrowLeftIcon />
              <Box marginLeft="2px" fontSize="16px">Back</Box>
            </TextButton>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            <Heading1>Backup guardians</Heading1>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginBottom="60px">
            <TextBody color="#1E1E1E" textAlign="center" fontSize="14px">
              Save your guardians list for easy wallet recovery.
            </TextBody>
          </Box>
          <Box>
            <Button
              onClick={handleDownloadGuardians}
              disabled={downloading}
              loading={downloading}
              _styles={{ width: '320px', background: '#9648FA' }}
              _hover={{ background: '#9648FA' }}
              LeftIcon={<DownloadIcon />}
            >
              Download
            </Button>
            <TextBody marginTop="8px" textAlign="center" display="flex" alignItems="center" justifyContent="center">Or</TextBody>
            <FormInput
              label=""
              placeholder="Send to Email"
              value={emailForm.values.email}
              errorMsg={emailForm.showErrors.email && emailForm.errors.email}
              onChange={emailForm.onChange('email')}
              onBlur={emailForm.onBlur('email')}
              onEnter={handleEmailBackupGuardians}
              _styles={{ width: '320px', marginTop: '8px' }}
              _inputStyles={{ background: 'white' }}
              RightIcon={
                <IconButton
                  onClick={handleEmailBackupGuardians}
                  disabled={sending || !emailForm.values.email}
                  loading={sending}
                >
                  {!emailForm.values.email && <SendIcon opacity="0.4" />}
                  {!!emailForm.values.email && <SendIcon color={'#EE3F99'} />}
                </IconButton>
              }
            />
            <Button
              onClick={handleSubmit}
              disabled={!isDone || loading || disabled}
              loading={loading}
              _styles={{ width: '320px', marginTop: '60px' }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Fragment>
      <Box width="100%" bg="#EDEDED" borderRadius="20px" padding="45px" display="flex" alignItems="flex-start" justifyContent="space-around" margin="0 auto">
        <Box width="40%" marginRight="45px">
          <Heading1>Guardians</Heading1>
          <TextBody fontSize="18px" marginBottom="20px">Please enter Ethereum wallet address to set up guardians.</TextBody>
          <Box>
            <TextButton _styles={{ padding: '0', color: '#EC588D' }} _hover={{ color: '#EC588D' }} onClick={() => setIsModalOpen(true)}>
              Learn more
            </TextButton>
          </Box>
        </Box>
        <Box width="60%">
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
              gap="12px"
              maxWidth="100%"
            >
              {guardianIds.map((id: any, i: number) => (
                <Box position="relative" key={id}>
                  <DoubleFormInput
                    rightPlaceholder={`Guardian address ${i + 1}`}
                    rightValue={values[`address_${id}`]}
                    rightOnChange={onChange(`address_${id}`)}
                    rightOnBlur={onBlur(`address_${id}`)}
                    rightErrorMsg={showErrors[`address_${id}`] && errors[`address_${id}`]}
                    _rightInputStyles={
                    !!values[`address_${id}`]
                    ? {
                      fontFamily: 'Martian',
                      fontWeight: 600,
                      fontSize: '14px',
                    }
                    : {}
                    }
                    _rightContainerStyles={{ width: '70%', minWidth: '520px' }}
                    leftAutoFocus={id === guardianIds[0]}
                    leftPlaceholder="Name"
                    leftValue={values[`name_${id}`]}
                    leftOnChange={onChange(`name_${id}`)}
                    leftOnBlur={onBlur(`name_${id}`)}
                    leftErrorMsg={showErrors[`name_${id}`] && errors[`name_${id}`]}
                    leftComponent={
                      <Text color="#898989" fontWeight="600">
                        eth:
                      </Text>
                    }
                    _leftContainerStyles={{ width: '30%', minWidth: '240px' }}
                    onEnter={() => setIsConfirmOpen(false)}
                    _styles={{ width: '100%', minWidth: '760px', fontSize: '16px' }}
                  />
                  {i > 0 && (
                    <Box
                      onClick={() => removeGuardian(id)}
                      position="absolute"
                      width="40px"
                      right="-40px"
                      top="0"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      cursor="pointer"
                    >
                      <Icon src={MinusIcon} />
                    </Box>
                  )}
                </Box>
              ))}
              <TextButton onClick={() => addGuardian()} color="#EC588D" _hover={{ color: '#EC588D' }}>
                <PlusIcon color="#EC588D" />
                <Text fontSize="18px" marginLeft="5px">Add more guardians</Text>
              </TextButton>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box background="#EDEDED" borderRadius="20px" padding="16px 45px" display="flex" marginTop="36px">
        <Box width="40%" display="flex" alignItems="center">
          <Heading1 marginBottom="0">Threshold</Heading1>
        </Box>
        <Box width="60%" display="flex" alignItems="center" paddingLeft="20px">
          <TextBody>Wallet recovery requires</TextBody>
          <Box width="80px" margin="0 10px">
            <Menu>
              <MenuButton
                px={2}
                py={2}
                width="80px"
                transition="all 0.2s"
                borderRadius="16px"
                borderWidth="1px"
                padding="12px"
                background="white"
                _hover={{
                  borderColor: '#3182ce',
                  boxShadow: '0 0 0 1px #3182ce',
                }}
                _expanded={{
                  borderColor: '#3182ce',
                  boxShadow: '0 0 0 1px #3182ce',
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  {amountForm.values.amount}
                  <DropDownIcon />
                </Box>
              </MenuButton>
              <MenuList>
                {!amountData.guardiansCount && (
                  <MenuItem key={nanoid(4)} onClick={selectAmount(0)}>
                    0
                  </MenuItem>
                )}
                {!!amountData.guardiansCount &&
                 getNumberArray(guardiansList.length || 0).map((i: any) => (
                   <MenuItem key={nanoid(4)} onClick={selectAmount(i)}>
                     {i}
                   </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
          <TextBody>out of {guardiansList.length || 0} guardian(s) confirmation. </TextBody>
        </Box>
      </Box>
      <TextButton onClick={() => setShowAdvance(!showAdvance)} color="#EC588D" _hover={{ color: '#EC588D' }} marginTop="20px">
        <Text fontSize="18px" marginRight="5px">Advance setting</Text>
        <Box transform={showAdvance ? 'rotate(-180deg)' : ''}><ArrowDownIcon color="#EC588D" /></Box>
      </TextButton>
      {showAdvance && (
        <Box background="#EDEDED" borderRadius="20px" padding="16px 45px" display="flex" marginTop="20px">
          <Box width="40%" display="flex" alignItems="center">
            <Heading1 marginBottom="0">
              Keep guardians private
            </Heading1>
            <Box height="100%" display="flex" alignItems="center" justifyContent="center" marginLeft="4px" paddingTop="4px" cursor="pointer">
              <Tooltip
                label={(
                  <Box background="white" padding="28px 24px 28px 24px" width="100%" borderRadius="16px" boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.4)">
                    <TextBody fontSize="16px" fontWeight="800">Privacy Setting</TextBody>
                    <TextBody fontSize="16px" fontWeight="600" marginBottom="20px">This setting will only reveal guardian address when you use the social recovery.</TextBody>
                    <TextBody fontSize="16px" fontWeight="600">But you need to enter the complete guardian list and threshold values for recovery.</TextBody>
                  </Box>
                )}
                placement="top"
                background="transparent"
                boxShadow="none"
              >
                <span><QuestionIcon /></span>
              </Tooltip>
            </Box>
          </Box>
          <Box width="60%" display="flex" alignItems="center" paddingLeft="20px">
            <Box width="72px" height="40px" background={keepPrivate ? '#1CD20F' : '#D9D9D9'} borderRadius="40px" padding="5px" cursor="pointer" onClick={() => setKeepPrivate(!keepPrivate)} transition="all 0.2s ease" paddingLeft={keepPrivate ? '37px' : '5px'}>
              <Box width="30px" height="30px" background="white" borderRadius="30px" />
            </Box>
            <TextBody marginLeft="20px">Backup guardians in the next step for easy recovery.</TextBody>
          </Box>
        </Box>
      )}
      <Box padding="40px">
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Button disabled={loading || disabled} loading={loading} _styles={{ width: '320px', background: '#1E1E1E', color: 'white' }} _hover={{ background: '#1E1E1E', color: 'white' }} onClick={() => setIsConfirmOpen(true)}>
            Confirm guardians
          </Button>
          {hasGuardians && (
            <TextButton _styles={{ width: '320px' }} onClick={cancelEdit}>
              Cancel
            </TextButton>
          )}
        </Box>
      </Box>
      <GuardianModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <DoubleCheckModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onSubmit={keepPrivate ? () => { setIsConfirmOpen(false); setStatus('backuping'); } : () => handleSubmit()} />
    </Fragment>
  )
}
