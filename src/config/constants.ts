import IconDashboard from '@/assets/icons/sidebar/dashboard.svg';
import IconDashboardActive from '@/assets/icons/sidebar/dashboard-active.svg';
import IconAssets from '@/assets/icons/sidebar/assets.svg';
import IconAssetsActive from '@/assets/icons/sidebar/assets-active.svg';
import IconActivity from '@/assets/icons/sidebar/activity.svg';
import IconActivityActive from '@/assets/icons/sidebar/activity-active.svg';
import IconDapps from '@/assets/icons/sidebar/dapps.svg';
import IconDappsActive from '@/assets/icons/sidebar/dapps-active.svg';
import IconSettings from '@/assets/icons/sidebar/settings.svg';
import IconSettingsActive from '@/assets/icons/sidebar/settings-active.svg';
import IconEmailGmail from '@/assets/emails/gmail.png';
import IconEmailOutlook from '@/assets/emails/outlook.png';
import IconEmailYahoo from '@/assets/emails/yahoo.png';
import IconEmailIcloud from '@/assets/emails/icloud.png';
import IconEmailProton from '@/assets/emails/proton.png';
import IconEmailGMX from '@/assets/emails/gmx.png';
import IconEmailAOL from '@/assets/emails/aol.png';

export const sidebarLinks = [
  {
    title: 'Dashboard',
    href: "/dashboard",
    icon: IconDashboard,
    iconActive: IconDashboardActive,
    isComing: false,
  },
  {
    title: 'Assets',
    href: "/asset",
    icon: IconAssets,
    iconActive: IconAssetsActive,
    isComing: false,
  },
  {
    title: 'Activity',
    href: "/activity",
    icon: IconActivity,
    iconActive: IconActivityActive,
    isComing: false,
  },
  {
    title: 'Dapps',
    href: "/dapps",
    icon: IconDapps,
    iconActive: IconDappsActive,
    isComing: true,
  },
  {
    title: 'Settings',
    href: "/security",
    icon: IconSettings,
    iconActive: IconSettingsActive,
    isComing: false,
  },
];

export const supportedEoas = ['injected', 'walletConnect', 'io.metamask'];

export const vaultsFyiEndpoint = 'https://api.vaults.fyi/v1'

export const forbiddenEmailProviders = ['qq.com', '163.com', '126.com'];

// export const validEmailDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'proton.me', 'protonmail.com'];

export const validEmailProviders = [
  {
    icon: IconEmailGmail,
    title: 'Gmail',
    domain: 'gmail.com',
  },
  {
    icon: IconEmailIcloud,
    title: 'Icloud',
    domain: 'icloud.com',
  },
  {
    icon: IconEmailYahoo,
    title: 'Yahoo mail',
    domain: 'yahoo.com',
  },
  {
    icon: IconEmailAOL,
    title: 'AOL',
    domain: 'aol.com',
  },
  {
    icon: IconEmailProton,
    title: 'Pronton',
    domain: 'proton.me',
  },
];

const extraEmailProviders = ['protonmail.com'];

export const validEmailDomains = [...validEmailProviders.map((provider) => provider.domain), ...extraEmailProviders];
