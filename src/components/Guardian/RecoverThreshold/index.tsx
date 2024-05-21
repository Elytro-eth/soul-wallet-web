import { Fragment } from 'react';
import { Image, Box, Menu, MenuList, MenuButton, MenuItem, Flex } from '@chakra-ui/react'
import TextBody from '@/components/new/TextBody'
import DropDownIcon from '@/components/Icons/DropDown';
import { nanoid } from 'nanoid';

const getNumberArray = (count: number) => {
  const arr = [];

  for (let i = 1; i <= count; i++) {
    arr.push(i);
  }

  return arr;
};

export default function RecoverThreshold({
  threshold,
  count,
  isEditing,
  selectAmount
}: any) {
  return (
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
          gap={{ base: 2, lg: 0 }}
        >
          <Box>Wallet recovery requires</Box>
          <Box
            width="80px"
            margin={{ base: '0', md: '0 10px' }}
          >
            {!isEditing && (
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
                  {threshold}
                  <DropDownIcon />
                </Box>
              </Box>
            )}
            {!!isEditing && (
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
                    {threshold}
                    <DropDownIcon />
                  </Box>
                </MenuButton>
                <MenuList>
                  {!count && (
                    <MenuItem key={nanoid(4)} onClick={selectAmount(0)}>
                      0
                    </MenuItem>
                  )}
                  {!!count &&
                   getNumberArray(count).map((i: any) => (
                     <MenuItem key={nanoid(4)} onClick={selectAmount(i)}>
                       {i}
                     </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            )}
          </Box>
          <Box>{`out of ${count} guardian(s) confirmation.`}</Box>
        </TextBody>
      </Flex>
    </Fragment>
  )
}
