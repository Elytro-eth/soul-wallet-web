import { Box, Tabs, TabList, Tab, TabIndicator, TabPanels, TabPanel } from "@chakra-ui/react";
import { GuardianPage } from "../dashboard";
import PassKeyPage from "../passkeys";

export default function Setting() {
    return <Box
        h="100%"
        bg='white'
        overflowY="hidden"
    >
        <Tabs
            height='100%'
        >
            <TabList>
                <Tab p="20px">Account Recovery</Tab>
                <Tab p="20px">Passkeys</Tab>
            </TabList>
            <TabIndicator mt='-1.5px' height='2px' bg='#2D3CBD' borderRadius='1px' />
            <TabPanels>
                <TabPanel
                    overflowY="scroll"
                >
                    <GuardianPage isDashboard />
                </TabPanel>
                <TabPanel>
                    <PassKeyPage />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Box>
}
