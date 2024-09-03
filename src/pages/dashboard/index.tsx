import { useEffect } from 'react';
import {
  Box,
  Image,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure
} from '@chakra-ui/react';
import { Link, Outlet, useLocation, useOutletContext, useRoutes } from 'react-router-dom';
import useBrowser from '@/hooks/useBrowser';
import useScreenSize from '@/hooks/useScreenSize';
import { useAddressStore } from '@/store/address';
import { useGuardianStore } from '@/store/guardian';
import { ZeroHash } from 'ethers';
import ThemePage from '@/components/ThemeChange';
import SettingsMenu from '@/pages/settings/SettingsMenu.tsx'
import GuardianIntroPage from '@/pages/settings/Guardian/Intro'
import GuardianManagePage from '@/pages/settings/Guardian/Manage'
import AssetsIcon2 from '@/components/Icons/desktop/Assets';
import ActivityIcon2 from '@/components/Icons/desktop/Activity';
import SettingsIcon2 from '@/components/Icons/desktop/Settings';
import { thirdPartyLicenseUrl } from '@/config/constants';
import config from '@/config';
import { Header } from './Header';
import useWalletContext from '@/context/hooks/useWalletContext';

export function GuardianPage({ isDashboard }: any) {
  const { guardiansInfo } = useGuardianStore();

  if (!guardiansInfo || !guardiansInfo.guardianHash || guardiansInfo.guardianHash === ZeroHash || true) {
    return (
      <GuardianIntroPage isDashboard={isDashboard} />
    )
  } else {
    return (
      <GuardianManagePage isDashboard={isDashboard} />
    )
  }
}

export default function Dashboard() {
  const { selectedAddress } = useAddressStore();
  const { innerHeight } = useScreenSize();
  const { navigate } = useBrowser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { openModal } = useWalletContext()
  const location = useLocation()
  const sideMenus = [{
    icon: (props: any) => <AssetsIcon2 {...props} />,
    name: 'Assets',
    link: '/dashboard/assets'
  }, {
    icon: (props: any) => <ActivityIcon2 {...props} />,
    name: 'Activity',
    link: '/dashboard/activity'
  }, {
    icon: (props: any) => <SettingsIcon2 {...props} />,
    name: 'Settings',
    link: '/dashboard/settings'
  }]

  useEffect(() => {
    if (!selectedAddress) {
      navigate('/landing')
    }
  }, [selectedAddress])

  return (
    <ThemePage themeColor="#F2F3F5">
      <Box
        height={innerHeight}
        background={{
          sm: `#F2F3F5`,
          md: 'radial-gradient(100% 336.18% at 0% 0%, #FFFAF5 4.96%, #F7F1F0 25.15%, #C8DCF3 100%)',
        }}
      >
        <Header
          paddingTop="10px"
          paddingBottom="10px"
          height="64px"
          background="transparent"
          openMenu={onOpen}
        />
        <Box
          display="flex"
          height={innerHeight - 64}
        >
          <Box
            minWidth={{
              sm: '0',
              md: '240px'
            }}
            height="100%"
            display={{
              sm: 'none',
              md: 'flex'
            }}
            padding="24px 0"
            flexDirection="column"
          >
            <Box width="100%">
              {
                sideMenus.map(({
                  icon,
                  name,
                  link
                }) => (
                  <Link to={link}>
                    <Box
                      width="100%"
                      padding="12px 20px"
                      cursor="pointer"
                      display="flex"
                      alignItems="center"
                    >

                      <Box marginRight="8px">
                        {icon({
                          color: location.pathname === link ? '#2D3CBD' : '#676B75'
                        })}
                      </Box>
                      <Box
                        fontSize="18px"
                        fontWeight={location.pathname === link ? '500' : '400'}
                        color={location.pathname === link ? '#2D3CBD' : '#676B75'}
                        lineHeight="22.5px"
                      >
                        {name}
                      </Box>
                    </Box>
                  </Link>
                ))
              }
            </Box>
            <Box marginTop="auto">
              <Box color="#676B75" fontSize="12px" lineHeight="15px" fontWeight="400" paddingLeft="20px" paddingRight="20px" paddingBottom="12px">Version: Alpha 0.0.1</Box>
              <a href={thirdPartyLicenseUrl} target='_blank'>
                <Text color="#676B75" fontSize="12px" lineHeight="15px" fontWeight="400" paddingLeft="20px" paddingRight="20px" paddingBottom="16px">Third-party software license</Text>
              </a>
              <Box
                alignItems="center"
                justifyContent="flex-start"
                gap="17px"
                width="100%"
                display={{
                  sm: 'none',
                  md: 'flex'
                }}
                padding="0 20px"
              >
                {config.socials.map((item, index) => (
                  <a href={item.link} target='_blank' key={index}>
                    <Image src={item.icon} key={index} />
                  </a>
                ))}
              </Box>
            </Box>
          </Box>
          <Box
            width={{
              sm: '100%',
              md: 'calc(100% - 240px)'
            }}
            paddingRight={{
              sm: '0',
              md: '20px'
            }}
            marginBottom={{
              sm: '0',
              md: '20px'
            }}
          >
            <Box
              padding={{
                sm: (true) ? '8px' : '0',
                md: '0'
              }}
              height="100%"
              overflowY="scroll"
              borderRadius={{
                sm: '0',
                md: '32px',
              }}
            >
              <Outlet context={[openModal]} />
            </Box>
          </Box>
        </Box>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          motionPreset="slideInBottom"
          blockScrollOnMount={true}
        >
          <ModalOverlay height="100vh" />
          <ModalContent
            borderRadius={{
              sm: '32px 32px 0 0',
              md: '32px',
            }}
            maxW={{
              sm: '100vw',
              md: '430px',
            }}
            marginTop={{
              sm: `${innerHeight - 474}px`,
              md: 'calc(50vh - 237px)',
            }}
            height={474}
            overflow="visible"
            mb="0"
            position="relative"
            overflowY="scroll"
          >
            <ModalCloseButton />
            <ModalBody
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
              width="100%"
              paddingLeft="0"
              paddingRight="0"
              paddingTop="60px"
            >
              <SettingsMenu closeModal={onClose} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </ThemePage>
  );
}
