import { useState, useCallback, Fragment, useRef, useEffect } from 'react';
import { SectionMenu, SectionMenuItem } from '@/components/new/SectionMenu';
import { Box } from '@chakra-ui/react';
import RemoveGuardianModal from '@/pages/security/RemoveGuardianModal';
import EditGuardianModal from '@/pages/security/EditGuardianModal';
import AddEmailGuardianModal from '@/pages/security/AddEmailGuardianModal';
import PendingGuardianModal from '@/pages/security/PendingGuardianModal';
import SelectGuardianTypeModal from '@/pages/security/SelectGuardianTypeModal';
import IntroGuardianModal from '@/pages/security/IntroGuardianModal';
import useBrowser from '@/hooks/useBrowser';
import { useTempStore } from '@/store/temp';
import { useGuardianStore } from '@/store/guardian';
import { useSettingStore } from '@/store/setting';
import EditGuardian from '../EditGuardian';
import ListGuardian from '../ListGuardian';
import useQuery from '@/hooks/useQuery';
import { useAddressStore } from '@/store/address';

const defaultGuardianDetails = {
  guardians: [],
  guardianNames: [],
  threshold: 0,
};

const defaultGuardianInfo = {
  guardianDetails: defaultGuardianDetails,
};

export default function Guardian() {
  const [isPending, setIsPending] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [isEditGuardianOpen, setIsEditGuardianOpen] = useState<boolean>(false);
  const [isAddEmailGuardianOpen, setIsAddEmailGuardianOpen] = useState<boolean>(false);
  const [isPendingGuardianOpen, setIsPendingGuardianOpen] = useState<boolean>(false);
  const [isRemoveGuardianOpen, setIsRemoveGuardianOpen] = useState<boolean>(false);
  const [isSelectGuardianOpen, setIsSelectGuardianOpen] = useState<boolean>(false);
  const [isIntroGuardianOpen, setIsIntroGuardianOpen] = useState<boolean>(false);

  const { navigate } = useBrowser();
  const { getGuardianDetails } = useQuery();
  const { selectedAddress } = useAddressStore();
  const [editType, setEditType] = useState<any>('edit');
  const [removeIndex, setRemoveIndex] = useState<number>(0);
  const [removeAddress, setRemoveAddress] = useState<string>('');
  const [editingAddressCount, setEditingAddressCount] = useState<number>(0);
  const { saveAddressName } = useSettingStore();

  const tempStore = useTempStore();
  const {
    getEditingGuardiansInfo,
    setEditingGuardiansInfo,
    updateEditingGuardiansInfo,
    setEditingSingleGuardiansInfo,
    getEditingSingleGuardiansInfo,
  } = tempStore;
  const guardianStore = useGuardianStore();
  const guardiansInfo = guardianStore.guardiansInfo || defaultGuardianInfo;

  const openModal = useCallback((name: string) => {
    if (name === 'editGuardian') {
      setIsEditGuardianOpen(true)
    } else if (name === 'addEmailGuardian') {
      setIsAddEmailGuardianOpen(true)
    } else if (name === 'pendingGuardian') {
      setIsPendingGuardianOpen(true)
    } else if (name === 'removeGuardian') {
      setIsRemoveGuardianOpen(true)
    } else if (name === 'selectGuardian') {
      setIsSelectGuardianOpen(true)
    } else if (name === 'introGuardian') {
      setIsIntroGuardianOpen(true)
    }
  }, [])

  const closeModal = useCallback((name: string) => {
    if (name === 'editGuardian') {
      setIsEditGuardianOpen(false)
    } else if (name === 'addEmailGuardian') {
      setIsAddEmailGuardianOpen(false)
    } else if (name === 'pendingGuardian') {
      setIsPendingGuardianOpen(false)
    } else if (name === 'removeGuardian') {
      setIsRemoveGuardianOpen(false)
    } else if (name === 'selectGuardian') {
      setIsSelectGuardianOpen(false)
    } else if (name === 'introGuardian') {
      setIsIntroGuardianOpen(false)
    }
  }, [])

  const startAddGuardian = useCallback(() => {
    if (!isEditing) {
      setEditingGuardiansInfo(guardiansInfo);
    }

    setEditType('add');
    setIsEditing(true);
    openModal('selectGuardian')
  }, [isEditing, guardiansInfo]);

  const startRemoveGuardian = useCallback((i: any, address: any, count: any) => {
    setRemoveIndex(i);
    setRemoveAddress(address);
    setEditingAddressCount(count);
    openModal('removeGuardian')
  }, []);

  const enterEditGuardian = useCallback(() => {
    if (!isEditing) {
      setEditingGuardiansInfo(guardiansInfo);
    }

    setIsEditing(true);
  }, [isEditing, guardiansInfo]);

  const startEditSingleGuardian = useCallback(
    (info: any) => {
      setEditingSingleGuardiansInfo(info);
      setEditType('editSingle');
      setIsEditing(true);
      openModal('editGuardian')
    },
    [],
  );

  const cancelEditGuardian = useCallback(() => {
    setIsEditing(false);
  }, []);

  const onRemoveGuardianConfirm = useCallback((i: number) => {
    closeModal('removeGuardian')
    const editingGuardianInfo = getEditingGuardiansInfo();
    let currentAddresses = editingGuardianInfo.guardianDetails.guardians || [];
    let currentNames = editingGuardianInfo.guardianNames || [];
    currentNames = currentNames.filter((_: any, idx: any) => idx !== i);
    currentAddresses = currentAddresses.filter((_: any, idx: any) => idx !== i);

    updateEditingGuardiansInfo({
      guardianNames: currentNames,
      guardianDetails: {
        guardians: currentAddresses,
        threshold: 0,
      },
    });
  }, []);

  const onEditGuardianConfirm = useCallback(
    (addresses: string[], names: string[]) => {
      if (editType === 'edit') {
        closeModal('editGuardian')
        setIsEditing(true);

        for (let i = 0; i < addresses.length; i++) {
          const address = addresses[i];
          const name = names[i];
          if (address) saveAddressName(address.toLowerCase(), name);
        }

        setEditingGuardiansInfo({
          guardianNames: names,
          guardianDetails: {
            guardians: addresses,
            threshold: 0,
          },
        });
      } else if (editType === 'editSingle') {
        closeModal('editGuardian')

        const info = getEditingSingleGuardiansInfo();
        const i = info.i;

        const editingGuardianInfo = getEditingGuardiansInfo();
        const currentAddresses = editingGuardianInfo.guardianDetails
                               ? editingGuardianInfo.guardianDetails.guardians || []
                               : [];
        const currentNames = editingGuardianInfo.guardianNames || [];
        currentAddresses[i] = addresses[0];
        currentNames[i] = names[0];

        const address = addresses[0];
        const name = names[0];
        if (address) saveAddressName(address.toLowerCase(), name);

        updateEditingGuardiansInfo({
          guardianNames: currentNames,
          guardianDetails: {
            guardians: currentAddresses,
            threshold: 0,
          },
        });
      } else if (editType === 'add') {
        closeModal('editGuardian')
        closeModal('addEmailGuardian')
        const editingGuardianInfo = getEditingGuardiansInfo();
        const currentAddresses = editingGuardianInfo.guardianDetails
                               ? editingGuardianInfo.guardianDetails.guardians || []
                               : [];
        const currentNames = editingGuardianInfo.guardianNames || [];

        for (let i = 0; i < addresses.length; i++) {
          const address = addresses[i];
          const name = names[i];
          if (address) saveAddressName(address.toLowerCase(), name);
        }

        updateEditingGuardiansInfo({
          guardianNames: [...currentNames, ...names],
          guardianDetails: {
            guardians: [...currentAddresses, ...addresses],
            threshold: 0,
          },
        });
      }
    },
    [editType],
  );

  const refreshGuardianInfo = async () => {
    console.log('refresh guardian')
    const _guardiansInfo = await getGuardianDetails(selectedAddress);

    if (_guardiansInfo) {
      guardianStore.setGuardiansInfo({
        guardianHash: _guardiansInfo.guardian_hash,
        guardianDetails: _guardiansInfo.guardian_info,
      });
    }
  };

  useEffect(() => {
    if (!selectedAddress) {
      return;
    }
    refreshGuardianInfo();
    const interval = setInterval(() => {
      refreshGuardianInfo();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [selectedAddress]);

  return (
    <Fragment>
      <Box display="flex" flexDirection="column" padding={{ base: '0 24px', lg: 'auto' }} pt="6">
        <SectionMenu>
          <SectionMenuItem isActive={true} onClick={() => navigate('/security/guardian')}>
            Guardian
          </SectionMenuItem>
        </SectionMenu>
        {!!isEditing && (
          <EditGuardian
            cancelEditGuardian={cancelEditGuardian}
            startAddGuardian={startAddGuardian}
            startEditSingleGuardian={startEditSingleGuardian}
            startRemoveGuardian={startRemoveGuardian}
            onEdited={() => setIsEditing(false)}
          />
        )}
        {!isEditing && (
          <ListGuardian
            openModal={openModal}
            startAddGuardian={startAddGuardian}
            enterEditGuardian={enterEditGuardian}
            cancelEditGuardian={cancelEditGuardian}
            isPending={isPending}
          />
        )}
      </Box>
      <AddEmailGuardianModal
        isOpen={isAddEmailGuardianOpen}
        closeModal={closeModal}
        onConfirm={onEditGuardianConfirm}
      />
      <EditGuardianModal
        isOpen={isEditGuardianOpen}
        closeModal={closeModal}
        openModal={openModal}
        onConfirm={onEditGuardianConfirm}
        editType={editType}
      />
      <PendingGuardianModal
        isOpen={isPendingGuardianOpen}
        closeModal={closeModal}
      />
      <RemoveGuardianModal
        isOpen={isRemoveGuardianOpen}
        closeModal={closeModal}
        onConfirm={onRemoveGuardianConfirm}
        removeIndex={removeIndex}
        address={removeAddress}
        editingAddressCount={editingAddressCount}
      />
      <SelectGuardianTypeModal
        isOpen={isSelectGuardianOpen}
        openModal={openModal}
        closeModal={closeModal}
      />
      <IntroGuardianModal
        isOpen={isIntroGuardianOpen}
        openModal={openModal}
        closeModal={closeModal}
      />
    </Fragment>
  );
}
