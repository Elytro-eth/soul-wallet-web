import { Box } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import GuardianGuide from './GuardianGuide';
import Balance from './Balance';
import ActivityList from '../activity/ActivityList';
import MobileActionBar from './MobileActionBar';
import Tokens from './Tokens';

export function AssetPage() {
    return (
        <Box
            height="100%"
            display='flex'
            flexDirection={{
                sm: 'column',
                md: 'row'
            }}
        >
            <Box
                flexBasis={{
                    md: '56%'
                }}
                display="flex"
                height={{
                    sm: 'auto',
                    md: '100%'
                }}
            >
                <Box width="100%">
                    <GuardianGuide />
                    <Box
                        width="100%"
                        padding={{
                            sm: '0 8px',
                            md: '32px',
                        }}
                        background={{
                            sm: 'transparent',
                            md: 'white'
                        }}
                        borderRadius={{
                            sm: '0',
                            md: '32px'
                        }}
                        marginBottom={{
                            sm: '0',
                            md: '20px'
                        }}
                    >
                        <Balance />
                    </Box>
                    <Box
                        width="100%"
                        background="white"
                        borderRadius="32px"
                        position="relative"
                        zIndex="1"
                        paddingBottom={{
                            sm: '0',
                            md: '4px'
                        }}
                        display={{
                            sm: 'none',
                            md: 'flex'
                        }}
                        height="calc(100% - 220px)"
                        flexDirection="column"
                        overflow='hidden'
                        py="22px"
                        px='20px'
                    >
                        <Box
                            fontSize='22px'
                            fontWeight="500"
                            color="#161F36"
                            display={{
                                sm: 'none',
                                md: 'flex'
                            }}
                            alignItems="center"
                            justifyContent="span-between"
                            width="100%"
                            height="60px"
                        >
                            <Box>Activity</Box>
                            <Box color="#676B75" cursor="pointer" fontWeight="500" fontSize="14px" marginLeft="auto">
                                <Link to="/dashboard/activity">View more</Link>
                            </Box>
                        </Box>
                        <Box height='calc(100% - 60px)' overflow='auto'>
                            <ActivityList />
                        </Box>
                    </Box>

                    <Box
                        width="100%"
                        paddingLeft="8px"
                        paddingRight="8px"
                        marginTop="14px"
                        marginBottom="40px"
                        display={{
                            sm: 'flex',
                            md: 'none'
                        }}
                    >
                        <MobileActionBar />
                    </Box>
                </Box>
            </Box>
            <Box
                width={{
                    sm: '100%',
                    md: '44%'
                }}
                paddingLeft={{
                    sm: '0',
                    md: '20px',
                }}
            >
                <Tokens />
            </Box>
        </Box>
    )
}