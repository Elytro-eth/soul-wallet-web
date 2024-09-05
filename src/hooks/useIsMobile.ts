import { useMediaQuery } from "@chakra-ui/react";

export default function useIsMobile() {
    const [isMobile] = useMediaQuery('(max-width: 768px)');
    return isMobile;
}