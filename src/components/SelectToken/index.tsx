import { useEffect, useState, useRef } from 'react'
import { Box, Image, Menu, MenuList, MenuItem } from '@chakra-ui/react'
import USDCIcon from '@/assets/mobile/usdc.png'

const SelectToken = ({ selected, tokens, select, isOpen }: any) => {
  return (
    <Box width="100%">
      <Menu
        isOpen={isOpen}
        isLazy
      >
        {() => (
          <Box width="100%" overflow="auto">
            <MenuList background="white" width="100%" boxShadow="0px 0px 20px 0px rgba(0, 0, 0, 0.2)">
              {tokens.map((token: any) =>
                <MenuItem key={token.name} width="calc(100vw - 60px)" position="relative" padding="9px 16px" onClick={() => select(token)}>
                  <Box marginRight="8px">
                    <Image width="36px" height="36px" src={USDCIcon} />
                  </Box>
                  <Box fontSize="16px" fontWeight="600">{token.name}</Box>
                  <Box fontSize="12px" marginLeft="auto">{token.balance} Avail.</Box>
                </MenuItem>
              )}
            </MenuList>
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default SelectToken
