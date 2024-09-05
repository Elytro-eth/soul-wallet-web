
import AssetsIcon2 from '@/components/Icons/desktop/Assets';
import ActivityIcon2 from '@/components/Icons/desktop/Activity';
import SettingsIcon2 from '@/components/Icons/desktop/Settings';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
export default function SideMenu() {
    const location = useLocation()
    const sideMenus = [{
        icon: (props: any) => <AssetsIcon2 {...props} />,
        name: 'Assets',
        link: '/dashboard/assets'
    }, {
        icon: (props: any) => <ActivityIcon2 {...props} />,
        name: 'Activity',
        link: '/dashboard/activity'
    }, {
        icon: (props: any) => <SettingsIcon2 {...props} />,
        name: 'Settings',
        link: '/dashboard/settings'
    }]
    return sideMenus.map(({
        icon,
        name,
        link
    }) => (
        <Link to={link} key={name}>
            <Box
                width="100%"
                padding="12px 20px"
                cursor="pointer"
                display="flex"
                alignItems="center"
            >

                <Box marginRight="8px">
                    {icon({
                        color: location.pathname === link ? '#2D3CBD' : '#676B75'
                    })}
                </Box>
                <Box
                    fontSize="18px"
                    fontWeight={location.pathname === link ? '500' : '400'}
                    color={location.pathname === link ? '#2D3CBD' : '#676B75'}
                    lineHeight="22.5px"
                >
                    {name}
                </Box>
            </Box>
        </Link>
    ))
}