import { ChakraProvider } from '@chakra-ui/react';
import Fonts from '@/styles/Fonts';
import Theme from '@/styles/Theme';
import EnvCheck from '@/components/EnvCheck';
// import WagmiContext from '../components/WagmiContext';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
export default function CommonWrapper({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider theme={Theme} toastOptions={{ defaultOptions: { duration: 1300, position: 'top-right' } }}>
      <Fonts />
      <EnvCheck>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </EnvCheck>
    </ChakraProvider>
  );
}
