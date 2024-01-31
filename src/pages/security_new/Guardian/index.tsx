import { useState, useCallback, Fragment } from 'react';
import Header from '@/components/Header';
import { SectionMenu, SectionMenuItem } from '@/components/new/SectionMenu';
import RoundSection from '@/components/new/RoundSection'
import SignerCard from '@/components/new/SignerCard'
import GuardianCard from '@/components/new/GuardianCard'
import { Box, Menu, MenuList, MenuButton, MenuItem } from '@chakra-ui/react'
import SetSignerModal from '@/pages/security_new/SetSignerModal'
import SelectSignerTypeModal from '@/pages/security_new/SelectSignerTypeModal'
import SelectGuardianTypeModal from '@/pages/security_new/SelectGuardianTypeModal'
import IntroGuardianModal from '@/pages/security_new/IntroGuardianModal'
import EditGuardianModal from '@/pages/security_new/EditGuardianModal'
import BackupGuardianModal from '@/pages/security_new/BackupGuardianModal'
import WalletConnectModal from '@/pages/security_new/WalletConnectModal'
import Button from '@/components/new/Button'
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
  const [isBackupGuardianOpen, setIsBackupGuardianOpen] = useState<any>(false);
  const [isWalletConnectOpen, setIsWalletConnectOpen] = useState<any>(false);

  const [isEditing, setIsEditing] = useState<any>(false);
  const { getAddressName, saveAddressName } = useSettingStore();

  const tempStore = useTempStore();
  const { setEditingGuardiansInfo } = tempStore;
  const guardianStore = useGuardianStore();
  console.log('guardianStore111', guardianStore)
  const guardiansInfo = (!tempStore.createInfo.creatingGuardianInfo ? guardianStore.guardiansInfo : tempStore.getCreatingGuardianInfo()) || defaultGuardianInfo

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

  const openEditGuardianModal = useCallback(() => {
    setIsEditGuardianOpen(true)
  }, [])

  const closeEditGuardianModal = useCallback(() => {
    setIsEditGuardianOpen(false)
  }, [])

  const openBackupGuardianModal = useCallback(() => {
    setIsBackupGuardianOpen(true)
  }, [])

  const closeBackupGuardianModal = useCallback(() => {
    setIsBackupGuardianOpen(false)
  }, [])

  const startAddGuardian = useCallback(() => {
    if (!isEditing) {
      setEditingGuardiansInfo(guardiansInfo)
    }

    setIsSelectGuardianOpen(true)
  }, [isEditing, guardiansInfo])

  const startEditGuardian = useCallback(() => {
    console.log('guardiansInfo kkkk', guardiansInfo)
    if (!isEditing) {
      setEditingGuardiansInfo(guardiansInfo)
    }

    setIsEditGuardianOpen(true)
  }, [isEditing, guardiansInfo])

  const cancelEditGuardian = useCallback(() => {
    setIsEditing(false)
  }, [isEditing, guardiansInfo])

  const onEditGuardianConfirm = useCallback((addresses: any, names: any, threshold: any) => {
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
        threshold: threshold || 0
      }
    })
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
          />
        )}
        {!isEditing && (
          <ListGuardian
            openEditGuardianModal={openEditGuardianModal}
            startEditGuardian={startEditGuardian}
            cancelEditGuardian={cancelEditGuardian}
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
      />
      <EditGuardianModal
        isOpen={isEditGuardianOpen}
        onClose={closeEditGuardianModal}
        setIsSelectGuardianOpen={setIsSelectGuardianOpen}
        setIsEditGuardianOpen={setIsEditGuardianOpen}
        onConfirm={onEditGuardianConfirm}
        canGoBack={true}
      />
      <BackupGuardianModal
        isOpen={isBackupGuardianOpen}
        onClose={closeBackupGuardianModal}
      />
      <WalletConnectModal
        isOpen={isWalletConnectOpen}
        onClose={closeWalletConnectModal}
      />
    </Fragment>
  );
}
