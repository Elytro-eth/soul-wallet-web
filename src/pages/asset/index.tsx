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
                base: 'column',
                lg: 'row'
            }}
        >
            <Box
                flexBasis={{
                    lg: '56%'
                }}
                display="flex"
                height={{
                    base: 'auto',
                    lg: '100%'
                }}
            >
                <Box width="100%">
                    <GuardianGuide />
                    <Box
                        width="100%"
                        padding={{
                            base: '0 8px',
                            lg: '32px',
                        }}
                        background={{
                            base: 'transparent',
                            lg: 'white'
                        }}
                        borderRadius={{
                            base: '0',
                            lg: '32px'
                        }}
                        marginBottom={{
                            base: '0',
                            lg: '20px'
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
                            base: '0',
                            lg: '4px'
                        }}
                        display={{
                            base: 'none',
                            lg: 'flex'
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
                                base: 'none',
                                lg: 'flex'
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
                            base: 'flex',
                            lg: 'none'
                        }}
                    >
                        <MobileActionBar />
                    </Box>
                </Box>
            </Box>
            <Box
                width={{
                    base: '100%',
                    lg: '44%'
                }}
                flex={1}
                paddingLeft={{
                    base: '0',
                    lg: '20px',
                }}
                paddingBottom={{
                    base: '10px',
                    lg: '0',
                }}
            >
                <Tokens />
            </Box>
        </Box>
    )
}