
import { Box, Link } from '@chakra-ui/react';
import { tgTestLink } from '@/config';
import useWallet from '@/hooks/useWallet';
import SettingIcon from '@/components/Icons/mobile/Setting'
import PasskeyIcon from '@/components/Icons/mobile/Passkey'
import TelegramIcon from '@/components/Icons/mobile/Telegram'
import LicenseIcon from '@/components/Icons/mobile/License'
import LogoutIcon from '@/components/Icons/mobile/Logout'
import useWalletContext from '@/context/hooks/useWalletContext';
import useBrowser from '@/hooks/useBrowser';
import { useGuardianStore } from '@/store/guardian';
import { ZeroHash } from 'ethers';

export default function SettingsMenu({ closeModal }: { closeModal: () => void }) {
  const { openFullScreenModal } = useWalletContext();
  const { guardiansInfo, } = useGuardianStore();
  const { navigate } = useBrowser();
  const { logoutWallet } = useWallet();

  const doLogout = async () => {
    closeModal()
    logoutWallet();
  }

  const goGuardianSettings = async () => {
    closeModal();
    if (!guardiansInfo || !guardiansInfo.guardianHash || guardiansInfo.guardianHash === ZeroHash) {
      navigate('/guardian/intro')
    } else {
      navigate('/guardian/manage');
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
      height="100%"
      paddingLeft="30px"
      paddingRight="30px"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        gap="8px"
      >
        <Box
          width="100%"
          height="56px"
          fontSize="18px"
          fontWeight="500"
          py="10px"
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          onClick={goGuardianSettings}
        >
          <Box
            marginRight="12px"
            height="32px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <SettingIcon />
          </Box>
          <Box>Account recovery setting</Box>
        </Box>
        <Box
          width="100%"
          height="56px"
          fontSize="18px"
          fontWeight="500"
          py="10px"
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Box
            marginRight="12px"
            height="32px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <PasskeyIcon />
          </Box>
          <Link href='/passkeys' style={{ flex: 1 }}><Box>Passkeys</Box></Link>
        </Box>
        <a target='_blank' href={tgTestLink} style={{ width: "100%" }}>
          <Box
            width="100%"
            height="56px"
            fontSize="18px"
            fontWeight="500"
            py="10px"
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Box
              marginRight="12px"
              height="32px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <TelegramIcon />
            </Box>
            <Box>Join Telegram group</Box>
          </Box>
        </a>
        <Box width="100%" onClick={() => { closeModal(); openFullScreenModal('lisence') }}>
          <Box
            width="100%"
            height="56px"
            fontSize="18px"
            fontWeight="500"
            py="10px"
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Box
              marginRight="12px"
              height="32px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <LicenseIcon />
            </Box>
            <Box>Third party software license</Box>
          </Box>
        </Box>
      </Box>
      <Box
        height="1px"
        width="100%"
        background="#F2F3F5"
        marginTop="8px"
        marginBottom="8px"
      />
      <Box width="100%">
        <Box width="100%" onClick={doLogout}>
          <Box
            width="100%"
            height="56px"
            fontSize="18px"
            fontWeight="500"
            py="10px"
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            color="#E8424C"
          >
            <Box
              marginRight="12px"
              height="32px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <LogoutIcon />
            </Box>
            <Box>Logout</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
