import { Box, Heading, Text, Image, Grid } from "@chakra-ui/react";
import DeviceItem from "./deviceItem";
import Button from "@/components/Button";
import AddIcon from '@/assets/icons/add.svg'
import { ReactNode, useState } from "react";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { PasskeyDTO } from "@/lib/interface";
import { ICredentialItem, useSignerStore } from "@/store/signer";
import usePasskey from "@/hooks/usePasskey";
import { useAddressStore } from "@/store/address";
import { init } from '@paralleldrive/cuid2';
import { encodeFunctionData } from "viem";
import { ABI_SoulWalletOwnerManager } from "@soulwallet/abi";
import useWallet from "@/hooks/useWallet";
import IconLoading from '@/assets/mobile/loading.gif';
import { useChainStore } from "@/store/chain";

const cuid2 = init({ length: 4 })

const DevicesContainer = ({ children }: { children: ReactNode }) => <Grid
    marginTop={'20px'}
    templateColumns={{
        md: 'repeat(4, 1fr)',
        sm: 'repeat(1, 1fr)'
    }}
    gap={4}
>
    {children}
</Grid>

export default function PassKeyPage() {
    const { selectedChainId } = useChainStore();
    const [isAdding, setIsAdding] = useState(false)
    const { walletName, selectedAddress } = useAddressStore()
    const { sendTxs } = useWallet()
    const {
        createPasskey,
        backupCredential,
        setJwt,
        saveKeyInfo
    } = usePasskey();
    const { isPending, error, data: passkeys } = useQuery<{ data: { keys: PasskeyDTO[] } }>({
        queryKey: ['passkey-list'],
        queryFn: () => api.authenticated.getKeyList().then((res) => res),
    })
    const { getSelectedCredential } = useSignerStore()
    const localPasskey = getSelectedCredential()
    if (isPending) return 'Loading';
    const splitPasskey = (list: PasskeyDTO[], localkey: ICredentialItem) => {
        const local = list.find(l => l.credentialID === localkey.credentialID);
        const other = list.filter(l => l.credentialID !== localkey.credentialID);
        return {
            local,
            other
        }
    }
    const {
        local,
        other
    } = splitPasskey(passkeys!.data.keys, localPasskey)
    const addNewPasskey = async () => {
        try {
            setIsAdding(true);
            const passkeyName = `${walletName}-${cuid2()}`;
            const {
                credential,
                verifiedRegistration,
                challenge,
                registration
            } = await createPasskey(passkeyName);
            if (credential.onchainPublicKey) {
                const tx = {
                    from: selectedAddress,
                    to: selectedAddress,
                    data: encodeFunctionData({
                        abi: ABI_SoulWalletOwnerManager,
                        functionName: ABI_SoulWalletOwnerManager[0].name,
                        args: [credential.onchainPublicKey],
                    })
                }
                await sendTxs([tx]) // make passkey on chain
                await api.authenticated.addNewKey({ key: credential.onchainPublicKey })
                await backupCredential(credential)
                await setJwt(
                    selectedAddress,
                    selectedChainId,
                    challenge,
                    credential.credentialID,
                    registration
                )
                await saveKeyInfo(
                    credential.credentialID,
                    passkeyName,
                    verifiedRegistration
                );
            }
        } catch (err) {
            throw err;
        } finally {
            setIsAdding(false)
        }
    }
    return <Box
        width="100%"
        p='28px'
        pos={{
            md: "relative"
        }}
        overflowY='scroll'
    >
        <Box mb='20px'>
            <Heading as='h5' fontWeight={500} size='sm'>
                CURRENT SIGNED IN
            </Heading>
            <DevicesContainer>
                <DeviceItem
                    isCurrent
                    name={local?.name}
                    deviceType={local?.platform}
                />
            </DevicesContainer>
        </Box>
        {
            other.length ? <Box>
                <Heading as='h5' fontWeight={500} size='sm'>
                    ON OTHER DEVICES
                </Heading>
                <DevicesContainer>
                    {
                        other.map(o => <DeviceItem
                            key={o.credentialID}
                            isCurrent={false}
                            name={o.name}
                            deviceType={o.platform}
                        />)
                    }
                </DevicesContainer>
            </Box> : null
        }
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
                onClick={addNewPasskey}
            >
                {isAdding ? <Image src={IconLoading} width="50px" /> : <>
                    <Image src={AddIcon} />
                    <Text fontSize="14px">Add a new passkey</Text>
                </>}
            </Button>
        </Box>
    </Box >
}