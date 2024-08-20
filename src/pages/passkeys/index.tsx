import { Box, Heading, Text, Image } from "@chakra-ui/react";
import DeviceItem from "./deviceItem";
import Button from "@/components/Button";
import AddIcon from '@/assets/icons/add.svg'


export default function PassKeyPage() {
    return <Box width="100%" p='28px' pos={{
        md: "relative"
    }}>
        <Box mb='20px'>
            <Heading as='h5' size='sm'>
                CURRENT SIGNED IN
            </Heading>

            <DeviceItem />
        </Box>
        <Box>
            <Heading as='h5' size='sm'>
                ON OTHER DEVICES
            </Heading>
            <DeviceItem />
            <DeviceItem />
            <DeviceItem />
        </Box>
        <Box
            pos="absolute"
            bottom={{
                sm: '40px'
            }}
            top={{
                md: "40px"
            }}
            left={{
                sm: "40px",
                md: "unset"
            }}
            right="40px"
        >
            <Button
                type="white"
                w={{
                    sm: '100%',
                    md: 'auto'
                }}
                size="lg"
                fontWeight='normal'
            >
                <Image src={AddIcon} />
                <Text fontSize="14px">Add a new passkey</Text>
            </Button>
        </Box>
    </Box>
}