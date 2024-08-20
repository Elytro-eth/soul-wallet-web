import Header from "@/components/mobile/Header";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import PassKeyPage from "./index";
import useScreenSize from "@/hooks/useScreenSize";

export default function PassKeyMobile() {
    const { innerHeight } = useScreenSize();
    const navigate = useNavigate();
    return <Box width="100%" height={innerHeight} bg="#fff">
        <Header title="Passkeys" showBackButton onBack={() => navigate(-1)} />
        <PassKeyPage />
    </Box>
}