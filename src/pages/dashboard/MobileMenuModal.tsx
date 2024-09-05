import { DrawerOverlay, Drawer, DrawerBody, DrawerCloseButton, DrawerContent } from "@chakra-ui/react";
import SettingsMenu from "../settings/SettingsMenu";

export default function MobileMenuModal({
    isOpen,
    onClose
}: {
    isOpen: boolean,
    onClose: () => void
}) {
    return <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement='bottom'
        blockScrollOnMount
    >
        <DrawerOverlay />
        <DrawerContent
            borderRadius='32px 32px 0 0'
        >
            <DrawerCloseButton />
            <DrawerBody
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="center"
                width="100%"
                paddingLeft="0"
                paddingRight="0"
                paddingTop="40px"
            >
                <SettingsMenu closeModal={onClose} />
            </DrawerBody>
        </DrawerContent>
    </Drawer>
}