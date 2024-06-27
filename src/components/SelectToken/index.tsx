import { useEffect, useState, useRef } from 'react'
import { Box, Image, Menu, MenuList, MenuItem } from '@chakra-ui/react'
import USDCIcon from '@/assets/mobile/usdc.png'
import { useBalanceStore } from '@/store/balance'
import { toFixed } from '@/lib/tools'

const SelectToken = ({ select, isOpen }: any) => {
  const { tokenBalance } = useBalanceStore();
  console.log('T balance', tokenBalance)
  return (
    <Box width="100%">
      <Menu
        isOpen={isOpen}
        isLazy
      >
        {() => (
          <Box width="100%" overflow="auto">
            <MenuList
              background="white"
              width="100%"
              boxShadow="0px 4px 20px 0px rgba(0, 0, 0, 0.05)"
            >
              {tokenBalance.map((token: any) =>
                <MenuItem key={token.name} width="calc(100vw - 60px)" position="relative" padding="9px 16px" onClick={() => select(token)}>
                  <Box marginRight="8px">
                    <Image width="36px" height="36px" src={token.logoURI} />
                  </Box>
                  <Box fontSize="16px" fontWeight="500">{token.name}</Box>
                  <Box fontSize="12px" marginLeft="auto">{toFixed(token.tokenBalanceFormatted, 6)} Avail.</Box>
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
