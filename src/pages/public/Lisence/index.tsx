import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Link, Box } from '@chakra-ui/react';

const dependencies = [
  { name: '@chakra-ui/react', license: 'MIT', version: '2.8.2', url: 'https://github.com/chakra-ui/chakra-ui' },
  { name: '@emotion/react', license: 'MIT', version: '11.11.1', url: 'https://github.com/emotion-js/emotion' },
  { name: '@emotion/styled', license: 'MIT', version: '11.11.0', url: 'https://github.com/emotion-js/emotion' },
  {
    name: '@passwordless-id/webauthn',
    license: 'MIT',
    version: '1.5.0',
    url: 'https://github.com/passwordless-id/webauthn',
  },
  {
    name: '@peculiar/asn1-ecc',
    license: 'MIT',
    version: '2.3.6',
    url: 'https://github.com/PeculiarVentures/asn1-schema',
  },
  {
    name: '@peculiar/asn1-schema',
    license: 'MIT',
    version: '2.3.6',
    url: 'https://github.com/PeculiarVentures/asn1-schema',
  },
  {
    name: '@safe-global/safe-apps-sdk',
    license: 'MIT',
    version: '8.1.0',
    url: 'https://github.com/safe-global/safe-apps-sdk',
  },
  { name: '@soulwallet/abi', license: 'MIT', version: '0.3.2', url: 'https://github.com/SoulWallet/soulwalletlib' },
  { name: '@soulwallet/decoder', license: 'MIT', version: '0.3.2', url: 'https://github.com/SoulWallet/soulwalletlib' },
  { name: '@soulwallet/sdk', license: 'MIT', version: '0.3.5', url: 'https://github.com/SoulWallet/soulwalletlib' },
  { name: '@tanstack/react-query', license: 'MIT', version: '5.17.9', url: 'https://github.com/tanstack/query' },
  { name: '@types/node', license: 'MIT', version: '20.6.2', url: 'https://github.com/DefinitelyTyped/DefinitelyTyped' },
  {
    name: '@types/react',
    license: 'MIT',
    version: '18.2.21',
    url: 'https://github.com/DefinitelyTyped/DefinitelyTyped',
  },
  {
    name: '@types/react-dom',
    license: 'MIT',
    version: '18.2.7',
    url: 'https://github.com/DefinitelyTyped/DefinitelyTyped',
  },
  { name: 'axios', license: 'MIT', version: '1.5.0', url: 'https://github.com/axios/axios' },
  { name: 'bignumber.js', license: 'MIT', version: '9.1.2', url: 'https://github.com/MikeMcl/bignumber.js' },
  { name: 'ethers', license: 'MIT', version: '6.7.1', url: 'https://github.com/ethers-io/ethers.js' },
  { name: 'framer-motion', license: 'MIT', version: '10.16.4', url: 'https://github.com/framer/motion' },
  { name: 'immer', license: 'MIT', version: '10.0.2', url: 'https://github.com/immerjs/immer' },
  { name: 'qrcode', license: 'MIT', version: '1.5.3', url: 'https://github.com/soldair/node-qrcode' },
  { name: 'react', license: 'MIT', version: '18.2.0', url: 'https://github.com/facebook/react' },
  { name: 'react-dom', license: 'MIT', version: '18.2.0', url: 'https://github.com/facebook/react' },
  { name: 'react-helmet', license: 'MIT', version: '6.1.0', url: 'https://github.com/nfl/react-helmet' },
  { name: 'react-jazzicon', license: 'MIT', version: '1.0.4', url: 'https://github.com/marcusmolchany/react-jazzicon' },
  { name: 'react-router-dom', license: 'MIT', version: '6.16.0', url: 'https://github.com/remix-run/react-router' },
  { name: 'swiper', license: 'MIT', version: '11.0.7', url: 'https://github.com/nolimits4web/swiper' },
  { name: 'viem', license: 'MIT', version: '2.x', url: 'https://github.com/wagmi-dev/viem' },
  { name: 'wagmi', license: 'MIT', version: '2.5.7', url: 'https://github.com/wagmi-dev/wagmi' },
  { name: 'zustand', license: 'MIT', version: '4.4.1', url: 'https://github.com/pmndrs/zustand' },
  {
    name: '@types/qrcode',
    license: 'MIT',
    version: '1.5.2',
    url: 'https://github.com/DefinitelyTyped/DefinitelyTyped',
  },
  {
    name: '@types/react-helmet',
    license: 'MIT',
    version: '6.1.11',
    url: 'https://github.com/DefinitelyTyped/DefinitelyTyped',
  },
  {
    name: '@typescript-eslint/parser',
    license: 'BSD-2-Clause',
    version: '6.0.0',
    url: 'https://github.com/typescript-eslint/typescript-eslint',
  },
  { name: 'eslint', license: 'MIT', version: '8.45.0', url: 'https://github.com/eslint/eslint' },
  {
    name: 'eslint-config-prettier',
    license: 'MIT',
    version: '9.0.0',
    url: 'https://github.com/prettier/eslint-config-prettier',
  },
  { name: 'eslint-plugin-react-hooks', license: 'MIT', version: '4.6.0', url: 'https://github.com/facebook/react' },
  {
    name: 'eslint-plugin-react-refresh',
    license: 'MIT',
    version: '0.4.3',
    url: 'https://github.com/ArnaudBarre/eslint-plugin-react-refresh',
  },
  { name: 'prettier', license: 'MIT', version: '3.0.3', url: 'https://github.com/prettier/prettier' },
  { name: 'typescript', license: 'Apache-2.0', version: '5.0.2', url: 'https://github.com/Microsoft/TypeScript' },
  { name: 'vite', license: 'MIT', version: '4.4.5', url: 'https://github.com/vitejs/vite' },
  {
    name: 'vite-plugin-checker',
    license: 'MIT',
    version: '0.6.4',
    url: 'https://github.com/fi3ework/vite-plugin-checker',
  },
  {
    name: 'vite-plugin-remove-console',
    license: 'MIT',
    version: '2.2.0',
    url: 'https://github.com/xiaoxian521/vite-plugin-remove-console',
  },
];

export default function Lisence() {
  return (
    <Box overflowX="auto" height="100%" overflowY={'auto'}>
      <Box mt="16" px="6">
        This page shows what third-party software is used in SoulWallet, including the respective licenses and versions.
        Thanks to all open source authors for their efforts to make the world better 😸
      </Box>
      <TableContainer>
        <Table variant="simple">
          <TableCaption placement="top">Project Dependencies</TableCaption>
          <Thead>
            <Tr>
              <Th>Software</Th>
              <Th>License</Th>
              <Th>Version</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dependencies.map((dep, index) => (
              <Tr key={index}>
                <Td>
                  <Link href={dep.url} isExternal color="teal.500">
                    {dep.name}
                  </Link>
                </Td>
                <Td>{dep.license}</Td>
                <Td>{dep.version}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
