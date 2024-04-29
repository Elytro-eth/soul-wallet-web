import { useState, useCallback, Fragment, useEffect } from 'react';
import RoundSection from '@/components/new/RoundSection'
import GuardianCard from '@/components/new/GuardianCard'
import { Image, Box, Menu, MenuList, MenuButton, MenuItem, Flex } from '@chakra-ui/react'
import Button from '@/components/Button'
import PlusIcon from '@/components/Icons/Plus';
import HistoryIcon from '@/components/Icons/History';
import Title from '@/components/new/Title'
import TextBody from '@/components/new/TextBody'
import DropDownIcon from '@/components/Icons/DropDown';
import useBrowser from '@/hooks/useBrowser';
import { useTempStore } from '@/store/temp';
import { useGuardianStore } from '@/store/guardian';
import { useSettingStore } from '@/store/setting';
import EmptyGuardianIcon from '@/assets/icons/empty-guardian.svg'
import IconCheveronRight from '@/assets/icons/chevron-right.svg';

export default function ListGuardian({
  startEditGuardian,
  enterEditGuardian,
  openPendingGuardianModal,
  isPending
}: any) {
  const { getAddressName } = useSettingStore();
  const guardianStore = useGuardianStore();
  const { guardiansInfo } = guardianStore;

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

  return (
    <Fragment>
      <RoundSection marginTop="10px" background="white">
        <Fragment>
          <Box
            fontFamily="Nunito"
            fontWeight="700"
            fontSize="18px"
            display="flex"
            flexDirection={{ base: 'column', md: 'row' }}
          >
            <Box>Guardian List</Box>
            {/* <Box
                marginLeft={{ base: '0', md: 'auto' }}
                marginTop={{ base: '20px', md: '0' }}
                display="flex"
                alignItems="flex-start"
                justifyContent="center"
                flexDirection={{ base: 'column', md: 'row' }}
                width={{ base: '100%', md: 'auto' }}
                >
                {!!guardianList.length && (
                <Button
                size="mid"
                type="white"
                marginBottom={{ base: '20px', md: '0px' }}
                marginRight={{ base: '0px', md: '14px' }}
                width={{ base: '100%', md: 'auto' }}
                >
                <Box marginRight="2px"><HistoryIcon /></Box>
                Backup guardians
                </Button>
                )}
                </Box> */}
          </Box>
          {/* {isPending && (
              <Box
              background="#F3FBF2"
              borderRadius="8px"
              padding="8px 16px"
              fontFamily="Nunito"
              fontSize="14px"
              fontWeight="600"
              width="fit-content"
              marginTop="35px"
              marginBottom="18px"
              maxWidth="100%"
              >
              You have a pending guardian update. New guardians updating in <Box color="#0CB700" as="span">12h : 56m : 03s</Box><Box fontWeight="700" as="span" marginLeft="24px" cursor="pointer" display="inline-flex" onClick={openPendingGuardianModal}>Details<Box display="flex" alignItems="center" justifyContent="center"><Image src={IconCheveronRight} w="16px" h="16px" /></Box></Box>
              </Box>
              )} */}
          {!guardianList.length && (
            <Box width="100%" display="flex" alignItems="center" justifyContent="center">
              <Box display="flex" flexDirection="column" alignItems="center"  justifyContent="center">
                <Box width="85px" height="85px" borderRadius="85px">
                  <Image width="85px" height="85px" src={EmptyGuardianIcon} />
                </Box>
                <Box fontWeight="600" fontSize="14px" marginTop="10px">You currently have no guardians</Box>
              </Box>
            </Box>
          )}
          {!!guardianList.length && (
            <Box
              paddingTop="14px"
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-start"
              flexWrap="wrap"
            >
              {guardianDetails && guardianDetails.guardians && (
                <Fragment>
                  {guardianDetails.guardians.map((address: any, i: any) =>
                    <GuardianCard
                      key={i}
                      name={guardianNames[i] || 'No Name'}
                      address={address}
                      marginRight={{ base: '0px', md: '18px' }}
                      marginBottom="18px"
                      width={{ base: '100%', md: '272px' }}
                      cursor="pointer"
                    />
                  )}
                </Fragment>
              )}
            </Box>
          )}
          <Box borderTop="1px solid #F0F0F0" marginTop={{base: "12px", lg: "30px"}} paddingTop="20px">
            <Title
              fontFamily="Nunito"
              fontWeight="700"
              fontSize="18px"
              display="flex"
            >
              Recovery settings
            </Title>
            {!guardianList.length && (
              <Box display="flex" alignItems="center" justifyContent="center">
                <Box fontWeight="600" fontSize="14px" marginTop="20px" marginBottom="20px">Setup recovery threshold after added guardians</Box>
              </Box>
            )}
            {!!guardianList.length && (
              <Fragment>
                <Flex
                  justifyContent="flex-start"
                  marginTop="10px"
                  alignItems={{ base: 'flex-start', md: 'center' }}
                  flexDirection={{ base: 'column', md: 'row' }}
                  gap={{base: 2, lg: 0}}
                >
                  <Box
                    fontFamily="Nunito"
                    fontWeight="700"
                    fontSize="14px"
                    marginRight="6px"
                  >
                    Threshold:
                  </Box>
                  <TextBody
                    type="t2"
                    justifyContent="flex-start"
                    display="flex"
                    flexDirection={{ base: 'column', md: 'row' }}
                    alignItems={{ base: 'flex-start', md: 'center' }}
                    gap={{base: 2, lg: 0}}
                  >
                    <Box>Wallet recovery requires</Box>
                    <Box
                      width="80px"
                      margin={{ base: '0', md: '0 10px' }}
                    >
                      <Box
                        px={2}
                        py={2}
                        width="80px"
                        transition="all 0.2s"
                        borderRadius="16px"
                        borderWidth="1px"
                        padding="12px"
                        background="#F6F6F6"
                        _expanded={{
                          borderColor: '#3182ce',
                          boxShadow: '0 0 0 1px #3182ce',
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          {guardianDetails.threshold || 0}
                          <DropDownIcon />
                        </Box>
                      </Box>
                    </Box>
                    <Box>{`out of ${guardianDetails.guardians.length} guardian(s) confirmation.`}</Box>
                  </TextBody>
                </Flex>
              </Fragment>
            )}
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
        {(!guardianList || !guardianList.length) && (
          <Button size="mid" onClick={startEditGuardian}>
            <Box marginRight="6px"><PlusIcon color="white" /></Box>
            Add Guardian
          </Button>
        )}
        {(!!guardianList && !!guardianList.length) && (
          <Button size="mid" w="120px" onClick={enterEditGuardian}>
            Edit guardians
          </Button>
        )}
      </Box>
    </Fragment>
  )
}
