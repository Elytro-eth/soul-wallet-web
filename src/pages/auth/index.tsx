import React, { useState, useCallback } from 'react';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Text,
  Image,
  useToast,
  Grid,
  GridItem,
  Flex,
  Popover,
  PopoverTrigger,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import IconLogo from '@/assets/logo-all-v3.svg';
import IntroImg from '@/assets/Intro.jpg';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/new/Button'
import TwitterIcon from '@/components/Icons/Social/Twitter'
import TelegramIcon from '@/components/Icons/Social/Telegram'
import GithubIcon from '@/components/Icons/Social/Github'
import PasskeyIcon from '@/components/Icons/Intro/Passkey'
import AccountIcon from '@/components/Icons/Intro/Account'
import TransferIcon from '@/components/Icons/Intro/Transfer'
import TokenIcon from '@/components/Icons/Intro/Token'
import { useAccount } from 'wagmi'
import { useConnect } from 'wagmi'
import { useTempStore } from '@/store/temp';
import SetPasskey from './SetPasskey'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import SelectAccountModal from './SelectAccountModal'

export default function Auth() {
  const [step, setStep] = useState(0)
  const [authMethod, setAuthMethod] = useState('eoa')
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isConnectAtive, setIsConnectAtive] = useState(false)
  const [activeConnector, setActiveConnector] = useState()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isSelectAccountOpen, setIsSelectAccountOpen] = useState(false)
  const { connect } = useConnect()
  const { createInfo, updateCreateInfo } = useTempStore()
  const account = useAccount()
  const { address, isConnected, isConnecting } = account
  console.log('address', account, isConnecting, createInfo)

  const nextStep = useCallback(() => {
    setStep(step + 1)
  }, [step])

  const openLogin = useCallback(() => {
    setIsLoginOpen(true)
  }, [])

  const closeLogin = useCallback(() => {
    setIsLoginOpen(false)
  }, [])

  const openRegister = useCallback(() => {
    setIsRegisterOpen(true)
  }, [])

  const closeRegister = useCallback(() => {
    setIsRegisterOpen(false)
  }, [])

  const openSelectAccount = useCallback(() => {
    setIsSelectAccountOpen(true)
  }, [])

  const closeSelectAccount = useCallback(() => {
    setIsSelectAccountOpen(false)
  }, [])

  const startLogin = useCallback(() => {
    setIsLoginOpen(false)
    setIsSelectAccountOpen(true)
  }, [])

  const connectEOA = useCallback(async (connector: any) => {
    setIsConnectAtive(true)
    connect({ connector })
    setActiveConnector(connector)
  }, [])

  const startAuthWithPasskey = useCallback(() => {
    setIsConnectAtive(true)
    setAuthMethod('passkey')
    closeRegister()
  }, [])

  const startAuthWithEOA = useCallback((address: any) => {
    setIsConnectAtive(true)
    setAuthMethod('eoa')
    closeRegister()
    updateCreateInfo({
      eoaAddress: [address]
    })
    setStep(1)
  }, [])

  const jumpToHome = useCallback(() => {

  }, [])

  if (step === 1 || authMethod === 'passkey') {
    return (
      <SetPasskey />
    )
  }

  return (
    <Box width="100%" minHeight="100vh" background="#F2F4F7">
      <Box height="58px" padding="10px 20px">
        <Link to="/dashboard">
          <Image src={IconLogo} h="44px" />
        </Link>
      </Box>
      <Box
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="calc(100% - 58px)"
        flexDirection="column"
      >
        <RoundContainer
          width="1058px"
          maxWidth="100%"
          minHeight="544px"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          flexDirection={{ base: "column", md: "row" }}
          background="#FFFFFF"
        >
          <Box
            width={{ base: "100%", md: "50%" }}
            height="100%"
            padding="100px 60px"
          >
            <Heading marginBottom="40px" fontSize="40px">
              Your smart wallet for Ethereum L2s
            </Heading>
            <Box marginBottom="90px">
              <Box marginBottom="18px" height="20px" display="flex">
                <Box marginRight="14px"><PasskeyIcon /></Box>
                <Box>
                  <TextBody>
                    Self-custody with passkey
                  </TextBody>
                </Box>
              </Box>
              <Box marginBottom="18px" height="20px" display="flex">
                <Box marginRight="14px"><AccountIcon /></Box>
                <Box>
                  <TextBody>
                    Never lose your wallet
                  </TextBody>
                </Box>
              </Box>
              <Box marginBottom="18px" height="20px" display="flex">
                <Box marginRight="14px"><TransferIcon /></Box>
                <Box>
                  <TextBody>
                    Maximize flexibility when transacting
                  </TextBody>
                </Box>
              </Box>
              <Box marginBottom="18px" height="20px" display="flex">
                <Box marginRight="14px"><TokenIcon /></Box>
                <Box>
                  <TextBody>
                    Unified Ethereum Experience
                  </TextBody>
                </Box>
              </Box>
            </Box>
            <TextBody fontWeight="700" color="#818181">
              For more info, check out <Box as="a" color="#FF2E79">{`FAQs >`}</Box>
            </TextBody>
          </Box>
          <Box
            width={{ base: "100%", md: "50%" }}
            background="#F7F7FF"
            flex="1"
            display="flex"
            padding="60px"
          >
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box marginBottom="40px">
                <Image src={IntroImg} />
              </Box>
              <Box
                width="335px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  width="100%"
                  theme="primary"
                  themeColor="#FF2E79"
                  background="#FF2E79"
                  color="white"
                  marginBottom="18px"
                  _hover={{
                    background: "#FF2E79"
                  }}
                  onClick={openRegister}
                >
                  Create account
                </Button>
                <Button
                  width="100%"
                  theme="light"
                  marginBottom="48px"
                  onClick={openLogin}
                >
                  Login
                </Button>
                <TextBody>
                  Lost access to your account?
                </TextBody>
              </Box>
            </Box>
          </Box>
        </RoundContainer>
        <Box marginTop="40px">
          <TextBody
            fontWeight="600"
            color="#818181"
            fontSize="16px"
          >
            If you have any questions, reach out to us at <Box as="a" color="#2D5AF6" textDecoration="underline">support@soulwallet.io</Box>
          </TextBody>
          <Box display="flex" alignItems="center" justifyContent="center" marginTop="10px">
            <Box padding="10px"><TwitterIcon /></Box>
            <Box padding="10px"><TelegramIcon /></Box>
            <Box padding="10px"><GithubIcon /></Box>
          </Box>
        </Box>
        <LoginModal
          isOpen={isLoginOpen}
          onClose={closeLogin}
          startLogin={startLogin}
          connectEOA={connectEOA}
          isConnecting={isConnecting}
          isConnected={isConnected}
          isConnectAtive={isConnectAtive}
        />
        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={closeRegister}
          connectEOA={connectEOA}
          isConnecting={isConnecting}
          isConnected={isConnected}
          isConnectAtive={isConnectAtive}
          startAuthWithPasskey={startAuthWithPasskey}
          startAuthWithEOA={startAuthWithEOA}
          activeConnector={activeConnector}
          address={address}
        />
        <SelectAccountModal
          isOpen={isSelectAccountOpen}
          onClose={closeSelectAccount}
        />
      </Box>
    </Box>
  )
}
