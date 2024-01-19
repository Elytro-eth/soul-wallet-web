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

export default function CreateGuardian() {
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

  const [editingGuardianDetails, setEditingGuardianDetails] = useState<any>({
    guardians: [],
    guardianNames: [],
    threshold: 0
  });

  const { getAddressName } = useSettingStore();

  const tempStore = useTempStore();
  const guardianStore = useGuardianStore();
  const guardiansInfo = tempStore.createInfo.isCreated ? guardianStore.guardiansInfo : tempStore.getCreatingGuardianInfo()
  const updateGuardiansInfo = tempStore.createInfo.isCreated ? guardianStore.updateGuardiansInfo : tempStore.updateCreatingGuardianInfo

  const guardianDetails = (guardiansInfo && guardiansInfo.guardianDetails) || {
    guardians: [],
    guardianNames: [],
    threshold: 0
  }

  const guardianNames = (guardiansInfo && guardiansInfo.guardianDetails && guardiansInfo.guardianDetails.guardians && guardiansInfo.guardianDetails.guardians.map((address: any) => getAddressName(address && address.toLowerCase()))) || []

  const guardianList = guardianDetails.guardians.map((guardian: any, i: number) => {
    return {
      address: guardian,
      name: guardianNames[i]
    }
  })

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
    openSelectGuardianModal()
  }, [])

  const startEditing = useCallback(() => {
    setIsEditing(true)
  }, [])

  const endEditing = useCallback(() => {
    setIsEditing(false)
  }, [])

  const onGuardianListConfirm = useCallback((addresses: any, names: any) => {
    setIsEditGuardianOpen(false)
    startEditing()

    setEditingGuardianDetails({
      guardians: addresses,
      guardianNames: names,
      threshold: editingGuardianDetails.threshold || 0
    })
  }, [editingGuardianDetails])

  return (
    <Fragment>
      <RoundSection marginTop="10px" background="white">
        <Fragment>
          <Box
            fontFamily="Nunito"
            fontWeight="700"
            fontSize="18px"
            display="flex"
          >
            <Box>Guardian List</Box>
            {!!guardianList.length && (
              <Box marginLeft="auto">
                <TextButton type="mid" onClick={openBackupGuardianModal}>
                  <Box marginRight="6px"><HistoryIcon /></Box>
                  Back up list
                </TextButton>
                <Button type="mid" onClick={openSelectGuardianModal}>
                  <Box marginRight="6px"><PlusIcon color="white" /></Box>
                  Add Guardian
                </Button>
              </Box>
            )}
          </Box>
          <Box
            paddingTop="14px"
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
          >
            {editingGuardianDetails && editingGuardianDetails.guardians && (
              <Fragment>
                {editingGuardianDetails.guardians.map((address: any, i: any) =>
                  <GuardianCard
                    key={i}
                    name={editingGuardianDetails.guardianNames[i] || 'No Name'}
                    address={address}
                    time="Added on 2023-12-14 "
                    marginRight="18px"
                    cursor="pointer"
                    onClick={openSetDefaultModal}
                  />
                )}
              </Fragment>
            )}
          </Box>
          <Box borderTop="1px solid #F0F0F0" marginTop="30px" paddingTop="20px">
            <Title
              fontFamily="Nunito"
              fontWeight="700"
              fontSize="18px"
              display="flex"
            >
              Recovery settings
            </Title>
            <Fragment>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                marginTop="10px"
              >
                <Box
                  fontFamily="Nunito"
                  fontWeight="700"
                  fontSize="14px"
                  marginRight="6px"
                >
                  Threshold:
                </Box>
                <TextBody type="t2" display="flex" alignItems="center" justifyContent="flex-start">
                  <Box>Wallet recovery requires</Box>
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
                          {editingGuardianDetails.threshold}
                          <DropDownIcon />
                        </Box>
                      </MenuButton>
                      <MenuList>
                        {(new Array(editingGuardianDetails.threshold || 1)).fill(1).map((i: any) =>
                          <MenuItem>
                            {i}
                          </MenuItem>
                        )}
                      </MenuList>
                    </Menu>
                  </Box>
                  <Box>{`out of ${editingGuardianDetails.guardians.length} guardian(s) confirmation.`}</Box>
                </TextBody>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                marginTop="10px"
              >
                <Box
                  fontFamily="Nunito"
                  fontWeight="700"
                  fontSize="14px"
                  marginRight="6px"
                >
                  Advanced:
                </Box>
                <TextBody type="t2" display="flex" alignItems="center" justifyContent="flex-start">
                  <Box marginRight="10px">Keep guardians private</Box>
                  <Box width="72px" minWidth="72px" height="40px" background={keepPrivate ? '#1CD20F' : '#D9D9D9'} borderRadius="40px" padding="5px" cursor="pointer" onClick={() => setKeepPrivate(!keepPrivate)} transition="all 0.2s ease" paddingLeft={keepPrivate ? '37px' : '5px'}>
                    <Box width="30px" height="30px" background="white" borderRadius="30px" />
                  </Box>
                </TextBody>
              </Box>
            </Fragment>
          </Box>
        </Fragment>
      </RoundSection>
      <Box
        width="100%"
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Button type="mid" theme="light" padding="0 20px" marginRight="16px" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
        <Button type="mid" onClick={() => {}}>
          Continue to sign
        </Button>
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
        onConfirm={onGuardianListConfirm}
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
  )
}