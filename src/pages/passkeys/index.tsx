import { Box, Heading, Text, Image, Grid, useDisclosure } from "@chakra-ui/react";
import DeviceItem from "./deviceItem";
import Button from "@/components/Button";
import AddIcon from '@/assets/icons/add.svg'
import { ReactNode, useState } from "react";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { PasskeyDTO } from "@/lib/interface";
import { ICredentialItem, useSignerStore } from "@/store/signer";
import usePasskey, { Credential } from "@/hooks/usePasskey";
import { useAddressStore } from "@/store/address";
import { init } from '@paralleldrive/cuid2';
import { Address, encodeFunctionData, TransactionRequestBase } from "viem";
import { ABI_SoulWalletOwnerManager } from "@soulwallet/abi";
import IconLoading from '@/assets/loading.svg';
import { useChainStore } from "@/store/chain";
import { getCurrentDateFormatted } from "@/lib/tools";
import ReviewModal from "@/components/ReviewModal";
import { RegistrationEncoded, RegistrationParsed } from "@passwordless-id/webauthn/dist/esm/types";
import PageLoading from "@/components/PageLoading";

const cuid2 = init({ length: 4 })

const DevicesContainer = ({ children }: { children: ReactNode }) => <Grid
    marginTop={'20px'}
    templateColumns={{
        '2xl': 'repeat(4, 1fr)',
        xl: 'repeat(3, 1fr)',
        lg: 'repeat(2, 1fr)',
        md: 'repeat(1, 1fr)',
        sm: 'repeat(1, 1fr)'
    }}
    gap={4}
>
    {children}
</Grid>

export default function PassKeyPage() {
    const [tempChallenge, setChallenge] = useState<string>();
    const [tempCredential, setCredential] = useState<Credential>();
    const [tempVerifiedRegistration, setVerifiedRegistration] = useState<RegistrationParsed>()
    const [tempRegistration, setRegistration] = useState<RegistrationEncoded>()
    const [passkeyName, setPasskeyName] = useState<string>()
    const { selectedChainId } = useChainStore();
    const [isAdding, setIsAdding] = useState(false)
    const { walletName, selectedAddress } = useAddressStore()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [tx, setTx] = useState<TransactionRequestBase | null>(null)
    const {
        createPasskey, backupCredential, setJwt, saveKeyInfo
    } = usePasskey();
    const {
        isPending,
        error,
        data: passkeys,
        refetch
    } = useQuery<{ data: { keys: PasskeyDTO[] } }>({
        queryKey: ['passkey-list'],
        queryFn: () => api.authenticated.getKeyList().then((res) => res),
    })
    const { getSelectedCredential } = useSignerStore()
    const localPasskey = getSelectedCredential()
    if (isPending) return <PageLoading />;
    const splitPasskey = (list: PasskeyDTO[], localkey: ICredentialItem) => {
        const local = list.find(l => l.credentialID === localkey.credentialID);
        const other = list.filter(l => l.credentialID !== localkey.credentialID);
        return { local, other }
    }
    const { local, other } = splitPasskey(passkeys!.data.keys, localPasskey)
    const addNewPasskey = async () => {
        try {
            setIsAdding(true);
            const name = `${walletName}-${getCurrentDateFormatted()}-${cuid2()}`;
            const {
                credential,
                verifiedRegistration,
                challenge,
                registration
            } = await createPasskey(name);
            if (credential.onchainPublicKey) {
                const tx = {
                    from: selectedAddress as Address,
                    to: selectedAddress as Address,
                    data: encodeFunctionData({
                        abi: ABI_SoulWalletOwnerManager,
                        functionName: ABI_SoulWalletOwnerManager[0].name,
                        args: [credential.onchainPublicKey],
                    })
                }
                setChallenge(challenge)
                setCredential(credential)
                setVerifiedRegistration(verifiedRegistration)
                setRegistration(registration)
                setPasskeyName(name)
                setTx(() => {
                    onOpen();
                    return tx;
                })
            }
        } catch (err) {
            throw err;
        } finally {
            setIsAdding(false)
        }
    }
    const afterTransfer = async () => {
        if (tempCredential
            && tempCredential.onchainPublicKey
            && tempChallenge
            && tempRegistration
            && tempVerifiedRegistration
            && passkeyName
        ) {
            await api.authenticated.addNewKey({ key: tempCredential.onchainPublicKey })
            await backupCredential(tempCredential)
            await setJwt(
                selectedAddress,
                selectedChainId,
                tempChallenge,
                tempCredential.credentialID,
                tempRegistration
            )
            await saveKeyInfo(
                tempCredential.credentialID,
                passkeyName,
                tempVerifiedRegistration
            );
            refetch();
        }
    }
    return <>
        <Box
            width="100%"
            p='28px'
            pos={{ md: "relative" }}
            overflowY='scroll'
        >
            <Box mb='20px'>
                <Heading as='h5' fontWeight={500} size='sm'>
                    CURRENT SIGNED IN
                </Heading>
                <DevicesContainer>
                    <DeviceItem
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
                                name={o.name}
                                deviceType={o.platform}
                                onchainPublicKey={o.onchainPublicKey}
                                reFetch={refetch}
                            />)
                        }
                    </DevicesContainer>
                </Box> : null
            }
            <Box
                pos="absolute"
                bottom={{ sm: '40px' }}
                top={{ lg: "40px", md: '10px' }}
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
                    {isAdding ? <Image src={IconLoading} width="36px" height='36px' /> : <>
                        <Image src={AddIcon} />
                        <Text fontSize="14px">Add a new passkey</Text>
                    </>}
                </Button>
            </Box>
        </Box >
        <ReviewModal
            tx={tx}
            sendTo={selectedAddress as Address}
            isOpen={isOpen}
            actionName="Add New Passkey"
            onClose={onClose}
            afterTransfer={afterTransfer}
        />
    </>
}