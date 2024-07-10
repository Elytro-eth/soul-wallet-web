import { useState } from 'react';
import { Box, Image, Link } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import Button from '@/components/mobile/Button'
import { Link as Rlink } from 'react-router-dom';
import DetailsIMG from '@/components/Icons/mobile/Details'
import TabIcon from '@/components/Icons/mobile/Tab'
import { useNavigate } from 'react-router-dom';
import USDCIcon from '@/assets/mobile/usdc_lg.png'
import { aaveLink } from '@/config';
import useWallet from '@/hooks/useWallet';
import SettingIcon from '@/components/Icons/mobile/Setting'
import FaceIdIcon from '@/components/Icons/FaceId'
import TelegramIcon from '@/components/Icons/mobile/Telegram'
import LicenseIcon from '@/components/Icons/mobile/License'
import { headerHeight, tgLink } from '@/config';
import { useAddressStore } from '@/store/address';
import AddressIcon from '@/components/AddressIcon';
import LogoutIcon from '@/components/Icons/mobile/Logout'
import useWalletContext from '@/context/hooks/useWalletContext';
import useBrowser from '@/hooks/useBrowser';
import { useGuardianStore } from '@/store/guardian';
import { ZeroHash } from 'ethers';

export default function Settings({ isModal, closeModal }: any) {
  const { walletName, selectedAddress } = useAddressStore();
  const { guardiansInfo, } = useGuardianStore();
  const { navigate } = useBrowser();
  const { logoutWallet } = useWallet();

  const doLogout = async () => {
    closeModal()
    logoutWallet();
  }

  const goGuardianSettings = async () => {
    closeModal();
    if(!guardiansInfo || !guardiansInfo.guardianHash || guardiansInfo.guardianHash === ZeroHash){
      navigate('/guardian/intro')
    }else{
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
        width="100%"
        display="flex"
        alignItems="center"
        paddingBottom="24px"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginRight="12px"
        >
          <AddressIcon address={selectedAddress} width={48} />
        </Box>
        <Box fontSize="22px" lineHeight={"24pcx"} fontWeight="500">{walletName}</Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
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
          <Box>Account Recovery</Box>
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
            <FaceIdIcon />
          </Box>
          <Box>Device & passkey</Box>
          <Box
            marginLeft="auto"
            background="#F2F2F2"
            padding="3px 8px"
            fontSize="12px"
            fontWeight="400"
            rounded="4px"
          >
            Coming soon
          </Box>
        </Box>
        <a target='_blank' href={tgLink} style={{width: "100%"}}>
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
        <a style={{width: "100%"}}>
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
        </a>
      </Box>
      <Box width="100%" marginTop="auto" marginBottom="20px">
        <Button
          size="xl"
          width="100%"
          color="#E83D26"
          onClick={doLogout}
          type="red"
        >
          {/* <Box><LogoutIcon /></Box> */}
          Logout
        </Button>
      </Box>
    </Box>
  );
}
