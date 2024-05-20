import { useState, useCallback, Fragment, useEffect } from 'react';
import RoundSection from '@/components/new/RoundSection';
import GuardianCard from '@/components/new/GuardianCard';
import { Box, Image, Menu, MenuList, MenuButton, MenuItem, useToast, Flex } from '@chakra-ui/react';
import Button from '@/components/Button';
import PlusIcon from '@/components/Icons/Plus';
import HistoryIcon from '@/components/Icons/History';
import Title from '@/components/new/Title';
import TextBody from '@/components/new/TextBody';
import DropDownIcon from '@/components/Icons/DropDown';
import { useTempStore } from '@/store/temp';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useSettingStore } from '@/store/setting';
import useForm from '@/hooks/useForm';
import { defaultGuardianSafePeriod } from '@/config';
import { nanoid } from 'nanoid';
import useConfig from '@/hooks/useConfig';
import useWallet from '@/hooks/useWallet';
import { ethers } from 'ethers';
import { useGuardianStore } from '@/store/guardian';
import { useSlotStore } from '@/store/slot';
import { useSignerStore } from '@/store/signer';
import useTransaction from '@/hooks/useTransaction';
import api from '@/lib/api';
import EmptyGuardianIcon from '@/assets/icons/empty-guardian.svg';
import RemoveIcon from '@/components/Icons/Remove';
import useWalletContract from '@/hooks/useWalletContract';
import { SocialRecovery } from '@soulwallet/sdk';
import RecoverThreshold from '@/components/Guardian/RecoverThreshold'

const getRecommandCount = (c: number) => {
  if (!c) {
    return 0;
  }

  return Math.ceil(c / 2);
};

const getNumberArray = (count: number) => {
  const arr = [];

  for (let i = 1; i <= count; i++) {
    arr.push(i);
  }

  return arr;
};

const amountValidate = (values: any, props: any) => {
  const errors: any = {};

  if (
    !values.amount ||
    !Number.isInteger(Number(values.amount)) ||
    Number(values.amount) < 1
    // || Number(values.amount) > Number(props.guardiansCount)
  ) {
    errors.amount = 'Invalid Amount';
  }

  return errors;
};

export default function EditGuardian({
  cancelEditGuardian,
  startAddGuardian,
  startEditSingleGuardian,
  startRemoveGuardian,
  onEdited,
}: any) {
  const { getAddressName, saveAddressName, getGuardianAddressEmail } = useSettingStore();
  const { getEditingGuardiansInfo, updateEditingGuardiansInfo, clearCreateInfo } = useTempStore();
  const guardiansInfo = getEditingGuardiansInfo();
  const { changeGuardian } = useTransaction();
  const [isCreating, setIsCreating] = useState(false);
  const { setGuardiansInfo } = useGuardianStore();
  const [showGuardianTip1, setShowGuardianTip1] = useState(true);
  const [showGuardianTip2, setShowGuardianTip2] = useState(true);
  const { checkActivated } = useWalletContext();
  const toast = useToast();

  const guardianDetails = guardiansInfo?.guardianDetails || {
    guardians: [],
    threshold: 0,
  };

  const guardianNames =
    (guardiansInfo &&
     guardiansInfo?.guardianDetails &&
     guardiansInfo?.guardianDetails.guardians &&
     guardiansInfo?.guardianDetails.guardians.map((address: any) =>
       getAddressName(address && address.toLowerCase()),
    )) ||
    [];

  const guardianList = guardianDetails.guardians.map((guardian: any, i: number) => {
    return {
      address: guardian,
      name: guardianNames[i],
    };
  });

  // const [amountData, setAmountData] = useState<any>({ guardiansCount: guardianList.length });

  const amountForm = useForm({
    fields: ['amount'],
    validate: amountValidate,
    initialValues: {
      amount: guardianDetails.threshold
    },
  });

  const selectAmount = (amount: any) => () => {
    updateEditingGuardiansInfo({
      threshold: amount,
    });

    amountForm.onChange('amount')(amount);
  };

  useEffect(() => {
    updateEditingGuardiansInfo({
      threshold: getRecommandCount(guardianList.length),
    });
  }, [guardianList.length]);

  const next = async () => {
    try {
      setIsCreating(true);
      const guardianAddresses = guardianList.map((item: any) => item.address);
      const guardianNames = guardianList.map((item: any) => item.name);
      const threshold = amountForm.values.amount || 0;
      const newGuardianHash = SocialRecovery.calcGuardianHash(guardianAddresses, threshold);
      const newGuardianDetails = {
        guardians: guardianAddresses,
        threshold: Number(threshold),
        salt: ethers.ZeroHash,
      }

      const guardiansInfo = {
        guardianHash: newGuardianHash,
        guardianDetails: newGuardianDetails,
      };

      await api.guardian.backupGuardians(guardiansInfo);

      for (let i = 0; i < guardianAddresses.length; i++) {
        const address = guardianAddresses[i];
        const name = guardianNames[i];
        if (address) saveAddressName(address.toLowerCase(), name);
      }

      await changeGuardian(newGuardianHash, { ...newGuardianDetails, guardianNames });

      setGuardiansInfo(guardiansInfo);

      setIsCreating(false);
      checkActivated()
      onEdited();
    } catch (error: any) {
      setIsCreating(false);
      if (error.message) {
        toast({
          status: 'error',
          title: error.message,
        });
      }

      console.log('error', error.message);
    }
  }

  useEffect(() => {
    if (!amountForm.values.amount || Number(amountForm.values.amount) > guardianList.length) {
      amountForm.onChange('amount')(getRecommandCount(guardianList.length));
    }
  }, [guardianList.length, amountForm.values.amount]);

  return (
    <Fragment>
      <RoundSection marginTop="10px" background="white">
        <Fragment>
          <Box
            fontFamily="Nunito"
            fontWeight="700"
            fontSize="18px"
            display="flex"
            flexDirection={{ base: 'column', md: 'row' }}
          >
            <Box>Guardian List</Box>
            <Box
              marginLeft={{ base: '0', md: 'auto' }}
              marginTop={{ base: '20px', md: '0' }}
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              flexDirection={{ base: 'column', md: 'row' }}
              width={{ base: '100%', md: 'auto' }}
            >
              {!!guardianList.length && (
                <Button
                  size="mid"
                  onClick={() => startAddGuardian()}
                  marginBottom={{ base: '20px', md: '0px' }}
                  width={{ base: '100%', md: 'auto' }}
                >
                  <Box marginRight="6px">
                    <PlusIcon color="white" />
                  </Box>
                  Add Guardian
                </Button>
              )}
            </Box>
          </Box>
          {!guardianList.length && (
            <Box width="100%" display="flex" alignItems="center" justifyContent="center">
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Box width="85px" height="85px" borderRadius="85px">
                  <Image width="85px" height="85px" src={EmptyGuardianIcon} />
                </Box>
                <Box fontWeight="600" fontSize="14px" marginTop="10px">
                  You currently have no guardians
                </Box>
              </Box>
            </Box>
          )}
          {!!guardianList.length && (
            <Box paddingTop="14px" display="flex" alignItems="flex-start" justifyContent="flex-start" flexWrap="wrap">
              {guardianDetails && guardianDetails.guardians && (
                <Fragment>
                  {guardianDetails.guardians.map((address: any, i: any) => (
                    <GuardianCard
                      key={i}
                      name={guardianNames[i] || 'No Name'}
                      address={address}
                      cursor="pointer"
                      allowDelete={true}
                      onDelete={() => startRemoveGuardian(i, address, guardianDetails.guardians.length)}
                      allowEdit={!getGuardianAddressEmail(address)}
                      marginRight={{ base: '0px', md: '18px' }}
                      marginBottom="18px"
                      width={{ base: '100%', md: '272px' }}
                      height="140px"
                      onEdit={() =>
                        startEditSingleGuardian({
                          guardianDetails: {
                            guardians: [address],
                          },
                          guardianNames: [guardianNames[i]],
                          i,
                        })
                      }
                    />
                  ))}
                </Fragment>
              )}
            </Box>
          )}
          <Box borderTop="1px solid #F0F0F0"  marginTop={{base: "12px", lg: "30px"}} paddingTop="20px">
            <Title fontFamily="Nunito" fontWeight="700" fontSize="18px" display="flex">
              Recovery settings
            </Title>
            {!guardianList.length && (
              <Box display="flex" alignItems="center" justifyContent="center">
                <Box fontWeight="600" fontSize="14px" marginTop="20px" marginBottom="20px">
                  Setup recovery threshold after added guardians
                </Box>
              </Box>
            )}
            {!!guardianList.length && (
              <RecoverThreshold
                threshold={amountForm.values.amount || 0}
                count={guardianList.length || 0}
                isEditing={true}
                selectAmount={selectAmount}
              />
            )}
          </Box>
        </Fragment>
      </RoundSection>
      <Box width="100%" padding="20px" display="flex" alignItems="center" justifyContent="center">
        <Button size="mid" type="white" padding="0 20px" marginRight="16px" onClick={cancelEditGuardian}>
          Cancel
        </Button>
        {!!guardianList.length && (
          <Button
            size="mid"
            onClick={() => next()}
            isLoading={isCreating}
            disabled={isCreating || !guardianList.length}
          >
            Continue
          </Button>
        )}
        {!guardianList.length && (
          <Button size="mid" onClick={() => startAddGuardian()}>
            <Box marginRight="6px">
              <PlusIcon color="white" />
            </Box>
            Add Guardian
          </Button>
        )}
      </Box>
    </Fragment>
  );
}
