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
import { headerHeight, tgLink } from '@/config';
import { useAddressStore } from '@/store/address';
import AddressIcon from '@/components/AddressIcon';
import LogoutIcon from '@/components/Icons/mobile/Logout'
import useWalletContext from '@/context/hooks/useWalletContext';
import useBrowser from '@/hooks/useBrowser';

export default function Settings({ isModal }: any) {
  const { walletName, selectedAddress } = useAddressStore();
  const { closeModal } = useWalletContext()
  const { navigate } = useBrowser();
  const { logoutWallet } = useWallet();

  const doLogout = async () => {
    closeModal()
    logoutWallet();
  }

  const goGuardianSettings = async () => {
    closeModal();
    if(true){
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
      paddingTop="34px"
      paddingLeft="30px"
      paddingRight="30px"
    >
      <Box
        fontSize="18px"
        fontWeight="700"
        lineHeight="24px"
        width="100%"
      >

      </Box>
      <Box
        width="100%"
        display="flex"
        alignItems="center"
        paddingTop="30px"
        paddingBottom="24px"
        borderBottom="1px solid #E7E7E7"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginRight="12px"
        >
          <AddressIcon address={selectedAddress} width={48} />
        </Box>
        <Box fontSize="24px" fontWeight="700">{walletName}</Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        marginTop="24px"
      >
        <Box
          width="100%"
          fontSize="16px"
          fontWeight="700"
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
          <Box>Guardian settings</Box>
        </Box>
        <Box
          width="100%"
          fontSize="16px"
          fontWeight="700"
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
            fontSize="16px"
            fontWeight="700"
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
      </Box>
      <Box width="100%" marginTop="auto" marginBottom="40px">
        <Button
          size="xl"
          width="100%"
          background="#F2F2F2"
          color="#E83D26"
          onClick={doLogout}
          _hover={{ background: '#F2F2F2' }}
        >
          <Box><LogoutIcon /></Box>
          Logout
        </Button>
      </Box>
    </Box>
  );
}
