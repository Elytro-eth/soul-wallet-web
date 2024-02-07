import { useState, useCallback, Fragment, useRef } from 'react';
import Header from '@/components/Header';
import { SectionMenu, SectionMenuItem } from '@/components/new/SectionMenu';
import RoundSection from '@/components/new/RoundSection'
import SignerCard from '@/components/new/SignerCard'
import GuardianCard from '@/components/new/GuardianCard'
import { Box, Menu, MenuList, MenuButton, MenuItem } from '@chakra-ui/react'
import SetSignerModal from '@/pages/security/SetSignerModal'
import SelectSignerTypeModal from '@/pages/security/SelectSignerTypeModal'
import SelectGuardianTypeModal from '@/pages/security/SelectGuardianTypeModal'
import IntroGuardianModal from '@/pages/security/IntroGuardianModal'
import RemoveGuardianModal from '@/pages/security/RemoveGuardianModal'
import EditGuardianModal from '@/pages/security/EditGuardianModal'
import BackupGuardianModal from '@/pages/security/BackupGuardianModal'
import WalletConnectModal from '@/pages/security/WalletConnectModal'
import Button from '@/components/Button'
import TextButton from '@/components/new/TextButton'
import PlusIcon from '@/components/Icons/Plus';
import HistoryIcon from '@/components/Icons/History';
import Title from '@/components/new/Title'
import TextBody from '@/components/new/TextBody'
import DropDownIcon from '@/components/Icons/DropDown';
import useBrowser from '@/hooks/useBrowser';
import DashboardLayout from '@/components/Layouts/DashboardLayout';
import { useTempStore } from '@/store/temp';
import { useGuardianStore } from '@/store/guardian';
import { useSettingStore } from '@/store/setting';
import EditGuardian from '../EditGuardian'
import ListGuardian from '../ListGuardian'

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
  const [activeSection, setActiveSection] = useState<string>('guardian');
  const [keepPrivate, setKeepPrivate] = useState<any>(false);
  const [isSetDefaultOpen, setIsSetDefaultOpen] = useState<any>(false);
  const [isChooseSignerOpen, setIsChooseSignerOpen] = useState<any>(false);
  const [isSelectGuardianOpen, setIsSelectGuardianOpen] = useState<any>(false);
  const [isIntroGuardianOpen, setIsIntroGuardianOpen] = useState<any>(false);
  const [isEditGuardianOpen, setIsEditGuardianOpen] = useState<any>(false);
  const [isRemoveGuardianOpen, setIsRemoveGuardianOpen] = useState<any>(false);
  const [isBackupGuardianOpen, setIsBackupGuardianOpen] = useState<any>(false);
  const [isWalletConnectOpen, setIsWalletConnectOpen] = useState<any>(false);
  const [canBackToSelectGuardianType, setCanBackToSelectGuardianType] = useState<any>(false);
  const [editType, setEditType] = useState<any>('edit')
  const [count, setCount] = useState<any>(0)
  const [removeIndex, setRemoveIndex] = useState<any>(0)
  const [removeAddress, setRemoveAddress] = useState<any>('')

  const [isEditing, setIsEditing] = useState<any>(false);
  const { getAddressName, saveAddressName } = useSettingStore();
  const backupFinishedRef = useRef<any>()

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
  console.log('guardianStore111', guardiansInfo)

  const openSetDefaultModal = useCallback(() => {
    setIsSetDefaultOpen(true)
  }, [])

  const closeSetDefaultModal = useCallback(() => {
    setIsSetDefaultOpen(false)
  }, [])

  const openChooseSignerModal = useCallback(() => {
    setIsChooseSignerOpen(true)
  }, [])

  const closeChooseSignerModal = useCallback(() => {
    setIsChooseSignerOpen(false)
  }, [])

  const openWalletConnectModal = useCallback(() => {
    setIsWalletConnectOpen(true)
  }, [])

  const closeWalletConnectModal = useCallback(() => {
    setIsWalletConnectOpen(false)
  }, [])

  const openSelectGuardianModal = useCallback(() => {
    setIsSelectGuardianOpen(true)
  }, [])

  const closeSelectGuardianModal = useCallback(() => {
    setIsSelectGuardianOpen(false)
  }, [])

  const openIntroGuardianModal = useCallback(() => {
    setIsIntroGuardianOpen(true)
  }, [])

  const closeIntroGuardianModal = useCallback(() => {
    setIsIntroGuardianOpen(false)
  }, [])

  const openEditGuardianModal = useCallback((editType: any) => {
    setEditType(editType)
    setIsEditGuardianOpen(true)
  }, [])

  const closeEditGuardianModal = useCallback(() => {
    setIsEditGuardianOpen(false)
  }, [])

  const openBackupGuardianModal = useCallback((callback: any) => {
    setIsBackupGuardianOpen(true)
    backupFinishedRef.current = callback
    setKeepPrivate(!!callback)
  }, [])

  const closeBackupGuardianModal = useCallback((isDone: any) => {
    setIsBackupGuardianOpen(false)

    if (isDone && backupFinishedRef.current) {
      onBackupFinished()
    }
  }, [])

  const startAddGuardian = useCallback(() => {
    if (!isEditing) {
      setEditingGuardiansInfo(guardiansInfo)
    }

    setEditType('add')
    setCanBackToSelectGuardianType(true)
    setIsSelectGuardianOpen(true)
  }, [isEditing, guardiansInfo])

  const startRemoveGuardian = useCallback((i: any, address: any) => {
    setRemoveIndex(i)
    setRemoveAddress(address)
    setIsRemoveGuardianOpen(true)
  }, [])

  const enterEditGuardian = useCallback(() => {
    if (!isEditing) {
      setEditingGuardiansInfo(guardiansInfo)
    }

    setCanBackToSelectGuardianType(false)
    setIsEditing(true)
  }, [isEditing, guardiansInfo])

  const startEditGuardian = useCallback(() => {
    if (!isEditing) {
      setEditingGuardiansInfo(guardiansInfo)
    }

    setEditType('add')
    setCanBackToSelectGuardianType(false)
    setIsEditing(true)
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
    const currentAddresses = editingGuardianInfo.guardianDetails.guardians
    const currentNames = editingGuardianInfo.guardianNames
    currentNames.splice(i, 1)
    currentAddresses.splice(i, 1)

    updateEditingGuardiansInfo({
      guardianNames: currentNames,
      guardianDetails: {
        guardians: currentAddresses,
        threshold: 0
      }
    })
  }, [])

  const onEditGuardianConfirm = useCallback((addresses: any, names: any, i: any) => {
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

  const onBackupFinished = useCallback(() => {
    const callback = backupFinishedRef.current as any

    if (callback) {
      callback()
    }
  }, [])

  return (
    <Fragment>
      <Box
        display="flex"
        flexDirection="column"
        padding="0 40px"
        pt="6"
      >
        <SectionMenu>
          <SectionMenuItem
            isActive={activeSection == 'signer'}
            onClick={() => navigate('/security/signer')}
          >
            Signer
          </SectionMenuItem>
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
            openBackupGuardianModal={openBackupGuardianModal}
            startAddGuardian={startAddGuardian}
            startEditSingleGuardian={startEditSingleGuardian}
            startRemoveGuardian={startRemoveGuardian}
            count={count}
          />
        )}
        {!isEditing && (
          <ListGuardian
            openEditGuardianModal={openEditGuardianModal}
            startEditGuardian={startEditGuardian}
            enterEditGuardian={enterEditGuardian}
            startAddGuardian={startAddGuardian}
            cancelEditGuardian={cancelEditGuardian}
            openBackupGuardianModal={openBackupGuardianModal}
          />
        )}
      </Box>
      <SetSignerModal
        isOpen={isSetDefaultOpen}
        onClose={closeSetDefaultModal}
      />
      <SelectSignerTypeModal
        isOpen={isChooseSignerOpen}
        onClose={closeChooseSignerModal}
        startWalletConnect={openWalletConnectModal}
      />
      <SelectGuardianTypeModal
        isOpen={isSelectGuardianOpen}
        onClose={closeSelectGuardianModal}
        setIsIntroGuardianOpen={setIsIntroGuardianOpen}
        setIsSelectGuardianOpen={setIsSelectGuardianOpen}
        setIsEditGuardianOpen={setIsEditGuardianOpen}
      />
      <IntroGuardianModal
        isOpen={isIntroGuardianOpen}
        onClose={closeIntroGuardianModal}
        setIsIntroGuardianOpen={setIsIntroGuardianOpen}
        setIsSelectGuardianOpen={setIsSelectGuardianOpen}
      />
      <EditGuardianModal
        isOpen={isEditGuardianOpen}
        onClose={closeEditGuardianModal}
        setIsSelectGuardianOpen={setIsSelectGuardianOpen}
        setIsEditGuardianOpen={setIsEditGuardianOpen}
        onConfirm={onEditGuardianConfirm}
        canGoBack={canBackToSelectGuardianType}
        editType={editType}
      />
      <RemoveGuardianModal
        isOpen={isRemoveGuardianOpen}
        onClose={() => setIsRemoveGuardianOpen(false)}
        onConfirm={onRemoveGuardianConfirm}
        removeIndex={removeIndex}
        address={removeAddress}
      />
      <BackupGuardianModal
        isOpen={isBackupGuardianOpen}
        onClose={closeBackupGuardianModal}
        keepPrivate={keepPrivate}
      />
      <WalletConnectModal
        isOpen={isWalletConnectOpen}
        onClose={closeWalletConnectModal}
      />
    </Fragment>
  );
}
