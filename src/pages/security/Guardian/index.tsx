import { useState, useCallback, Fragment, useRef, useEffect } from 'react';
import { SectionMenu, SectionMenuItem } from '@/components/new/SectionMenu';
import { Box } from '@chakra-ui/react'
import RemoveGuardianModal from '@/pages/security/RemoveGuardianModal'
import EditGuardianModal from '@/pages/security/EditGuardianModal'
import AddEmailGuardianModal from '@/pages/security/AddEmailGuardianModal'
import PendingGuardianModal from '@/pages/security/PendingGuardianModal'
import SelectGuardianTypeModal from '@/pages/security/SelectGuardianTypeModal'
import IntroGuardianModal from '@/pages/security/IntroGuardianModal'
import useBrowser from '@/hooks/useBrowser';
import { useTempStore } from '@/store/temp';
import { useGuardianStore } from '@/store/guardian';
import { useSettingStore } from '@/store/setting';
import EditGuardian from '../EditGuardian'
import ListGuardian from '../ListGuardian'
import useQuery from '@/hooks/useQuery';
import { useAddressStore } from '@/store/address';

const defaultGuardianDetails = {
  guardians: [],
  guardianNames: [],
  threshold: 0
}

const defaultGuardianInfo = {
  guardianDetails: defaultGuardianDetails
}

export default function Guardian() {
  const { navigate } = useBrowser();
  const { getGuardianDetails } = useQuery();
  const [activeSection, setActiveSection] = useState<string>('guardian');
  const [isPending, setIsPending] = useState<any>(true);
  const [isEditGuardianOpen, setIsEditGuardianOpen] = useState<any>(false);
  const [isAddEmailGuardianOpen, setIsAddEmailGuardianOpen] = useState<any>(false);
  const [isPendingGuardianOpen, setIsPendingGuardianOpen] = useState<any>(false);
  const [isRemoveGuardianOpen, setIsRemoveGuardianOpen] = useState<any>(false);
  const [isSelectGuardianOpen, setIsSelectGuardianOpen] = useState<any>(false);
  const [isIntroGuardianOpen, setIsIntroGuardianOpen] = useState<any>(false);
  const { selectedAddress } = useAddressStore();
  const [canBackToSelectGuardianType, setCanBackToSelectGuardianType] = useState<any>(false);
  const [editType, setEditType] = useState<any>('edit')
  const [count, setCount] = useState<any>(0)
  const [removeIndex, setRemoveIndex] = useState<any>(0)
  const [removeAddress, setRemoveAddress] = useState<any>('')
  const [editingAddressCount, setEditingAddressCount] = useState<any>(0)
  const [isEditing, setIsEditing] = useState<any>(false);
  const { saveAddressName } = useSettingStore();

  const tempStore = useTempStore();
  const {
    getEditingGuardiansInfo,
    setEditingGuardiansInfo,
    updateEditingGuardiansInfo,
    setEditingSingleGuardiansInfo,
    getEditingSingleGuardiansInfo
  } = tempStore;
  const guardianStore = useGuardianStore();
  const guardiansInfo = (!tempStore.createInfo.creatingGuardianInfo ? guardianStore.guardiansInfo : tempStore.getCreatingGuardianInfo()) || defaultGuardianInfo
  console.log('guardiansInfo111', guardianStore.guardiansInfo, guardianStore.getGuardiansInfo())

  const closeSelectGuardianModal = useCallback(() => {
    setIsSelectGuardianOpen(false)
  }, [])

  const closeIntroGuardianModal = useCallback(() => {
    setIsIntroGuardianOpen(false)
  }, [])

  const openPendingGuardianModal = useCallback((editType: any) => {
    setIsPendingGuardianOpen(true)
  }, [])

  const closePendingGuardianModal = useCallback(() => {
    setIsPendingGuardianOpen(false)
  }, [])

  const openEditGuardianModal = useCallback((editType: any) => {
    setEditType(editType)
    setIsEditGuardianOpen(true)
  }, [])

  const closeEditGuardianModal = useCallback(() => {
    setIsEditGuardianOpen(false)
  }, [])

  const closeAddEmailGuardianModal = useCallback(() => {
    setIsAddEmailGuardianOpen(false)
  }, [])

  const startAddGuardian = useCallback(() => {
    if (!isEditing) {
      setEditingGuardiansInfo(guardiansInfo)
    }

    setEditType('add')
    setIsEditing(true)
    setCanBackToSelectGuardianType(true)
    // setIsEditGuardianOpen(true)
    setIsSelectGuardianOpen(true)
  }, [isEditing, guardiansInfo])

  const startRemoveGuardian = useCallback((i: any, address: any, count: any) => {
    setRemoveIndex(i)
    setRemoveAddress(address)
    setEditingAddressCount(count)
    setIsRemoveGuardianOpen(true)
  }, [])

  const enterEditGuardian = useCallback(() => {
    if (!isEditing) {
      setEditingGuardiansInfo(guardiansInfo)
    }

    setCanBackToSelectGuardianType(true)
    setIsEditing(true)
  }, [isEditing, guardiansInfo])

  const startEditGuardian = useCallback(() => {
    if (!isEditing) {
      setEditingGuardiansInfo(guardiansInfo)
    }

    setEditType('add')
    setIsEditing(true)
    setCanBackToSelectGuardianType(true)
    setIsEditGuardianOpen(true)
  }, [isEditing, guardiansInfo])

  const startEditSingleGuardian = useCallback((info: any) => {
    setEditingSingleGuardiansInfo(info)
    setEditType('editSingle')
    setCanBackToSelectGuardianType(false)
    setIsEditing(true)
    setIsEditGuardianOpen(true)
  }, [isEditing, guardiansInfo])

  const cancelEditGuardian = useCallback(() => {
    setIsEditing(false)
  }, [isEditing, guardiansInfo])

  const onRemoveGuardianConfirm = useCallback((i: any) => {
    setIsRemoveGuardianOpen(false)
    const editingGuardianInfo = getEditingGuardiansInfo()
    let currentAddresses = editingGuardianInfo.guardianDetails.guardians || []
    let currentNames = editingGuardianInfo.guardianNames || []
    currentNames = currentNames.filter((_: any, idx: any) => idx !== i)
    currentAddresses = currentAddresses.filter((_: any, idx: any) => idx !== i)

    updateEditingGuardiansInfo({
      guardianNames: currentNames,
      guardianDetails: {
        guardians: currentAddresses,
        threshold: 0
      }
    })
  }, [])

  const onEditGuardianConfirm = useCallback((addresses: any, names: any) => {
    if (editType === 'edit') {
      setIsEditGuardianOpen(false)
      setIsEditing(true)

      for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i]
        const name = names[i]
        if (address) saveAddressName(address.toLowerCase(), name);
      }

      setEditingGuardiansInfo({
        guardianNames: names,
        guardianDetails: {
          guardians: addresses,
          threshold: 0
        }
      })
    } else if (editType === 'editSingle') {
      setIsEditGuardianOpen(false)

      const info = getEditingSingleGuardiansInfo()
      const i = info.i

      const editingGuardianInfo = getEditingGuardiansInfo()
      const currentAddresses = editingGuardianInfo.guardianDetails ? (editingGuardianInfo.guardianDetails.guardians || []) : []
      const currentNames = editingGuardianInfo.guardianNames || []
      currentAddresses[i] = addresses[0]
      currentNames[i] = names[0]

      const address = addresses[0]
      const name = names[0]
      if (address) saveAddressName(address.toLowerCase(), name);

      updateEditingGuardiansInfo({
        guardianNames: currentNames,
        guardianDetails: {
          guardians: currentAddresses,
          threshold: 0
        }
      })
    } else if (editType === 'add') {
      setIsEditGuardianOpen(false)
      setIsAddEmailGuardianOpen(false);
      const editingGuardianInfo = getEditingGuardiansInfo()
      const currentAddresses = editingGuardianInfo.guardianDetails ? (editingGuardianInfo.guardianDetails.guardians || []) : []
      const currentNames = editingGuardianInfo.guardianNames || []

      for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i]
        const name = names[i]
        if (address) saveAddressName(address.toLowerCase(), name);
      }

      console.log('add11111', addresses, names, {
        guardianNames: [...currentNames, ...names],
        guardianDetails: {
          guardians: [...currentAddresses, ...addresses],
          threshold: 0
        }
      })
      updateEditingGuardiansInfo({
        guardianNames: [...currentNames, ...names],
        guardianDetails: {
          guardians: [...currentAddresses, ...addresses],
          threshold: 0
        }
      })
    }
  }, [editType, count])

  // const refreshGuardianInfo = async() => {
  //   getGuardianDetails(selectedAddress)
  // }

  // useEffect(()=>{
  //   if(!selectedAddress){
  //     return
  //   }
  //   refreshGuardianInfo()
  //   const interval = setInterval(()=>{
  //     refreshGuardianInfo();
  //   }, 10000)
  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [selectedAddress])

  return (
    <Fragment>
      <Box
        display="flex"
        flexDirection="column"
        padding={{ base: "0 24px", lg: "auto" }}
        pt="6"
      >
        <SectionMenu>
          <SectionMenuItem
            isActive={activeSection == 'guardian'}
            onClick={() => navigate('/security/guardian')}
          >
            Guardian
          </SectionMenuItem>
        </SectionMenu>
        {!!isEditing && (
          <EditGuardian
            startEditGuardian={startEditGuardian}
            cancelEditGuardian={cancelEditGuardian}
            startAddGuardian={startAddGuardian}
            startEditSingleGuardian={startEditSingleGuardian}
            startRemoveGuardian={startRemoveGuardian}
            count={count}
            onEdited={()=> setIsEditing(false)}
          />
        )}
        {!isEditing && (
          <ListGuardian
            openEditGuardianModal={openEditGuardianModal}
            openPendingGuardianModal={openPendingGuardianModal}
            startAddGuardian={startAddGuardian}
            enterEditGuardian={enterEditGuardian}
            cancelEditGuardian={cancelEditGuardian}
            isPending={isPending}
          />
        )}
      </Box>
      {isAddEmailGuardianOpen && <AddEmailGuardianModal
        isOpen={true}
        onClose={closeAddEmailGuardianModal}
        setIsAddEmailGuardianOpen={setIsAddEmailGuardianOpen}
        onConfirm={onEditGuardianConfirm}
        editType={editType}
      />}
      <EditGuardianModal
        isOpen={isEditGuardianOpen}
        onClose={closeEditGuardianModal}
        setIsEditGuardianOpen={setIsEditGuardianOpen}
        onConfirm={onEditGuardianConfirm}
        editType={editType}
      />
      <PendingGuardianModal
        isOpen={isPendingGuardianOpen}
        onClose={closePendingGuardianModal}
      />
      <RemoveGuardianModal
        isOpen={isRemoveGuardianOpen}
        onClose={() => setIsRemoveGuardianOpen(false)}
        onConfirm={onRemoveGuardianConfirm}
        removeIndex={removeIndex}
        address={removeAddress}
        editingAddressCount={editingAddressCount}
      />
      <SelectGuardianTypeModal
        isOpen={isSelectGuardianOpen}
        onClose={closeSelectGuardianModal}
        setIsIntroGuardianOpen={setIsIntroGuardianOpen}
        setIsSelectGuardianOpen={setIsSelectGuardianOpen}
        setIsEditGuardianOpen={setIsEditGuardianOpen}
        setIsAddEmailGuardianOpen={setIsAddEmailGuardianOpen}
      />
      <IntroGuardianModal
        isOpen={isIntroGuardianOpen}
        onClose={closeIntroGuardianModal}
        setIsIntroGuardianOpen={setIsIntroGuardianOpen}
        setIsSelectGuardianOpen={setIsSelectGuardianOpen}
      />
    </Fragment>
  );
}
