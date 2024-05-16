import IconDashboard from '@/assets/icons/sidebar/dashboard.svg';
import IconDashboardActive from '@/assets/icons/sidebar/dashboard-active.svg';
import IconAssets from '@/assets/icons/sidebar/assets.svg';
import IconAssetsActive from '@/assets/icons/sidebar/assets-active.svg';
import IconActivity from '@/assets/icons/sidebar/activity.svg';
import IconActivityActive from '@/assets/icons/sidebar/activity-active.svg';
// import IconDapps from '@/assets/icons/sidebar/dapps.svg';
// import IconDappsActive from '@/assets/icons/sidebar/dapps-active.svg';
import IconSettings from '@/assets/icons/sidebar/settings.svg';
import IconSettingsActive from '@/assets/icons/sidebar/settings-active.svg';
import IconEmailGmail from '@/assets/emails/gmail.svg';
import IconEmailOutlook from '@/assets/emails/outlook.svg';
import IconEmailYahoo from '@/assets/emails/yahoo.svg';
import IconEmailIcloud from '@/assets/emails/icloud.svg';
import IconEmailProton from '@/assets/emails/proton.svg';

export const sidebarLinks = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: IconDashboard,
    iconActive: IconDashboardActive,
    isComing: false,
    requireActivated: false,
  },
  {
    title: 'Assets',
    href: '/asset',
    icon: IconAssets,
    iconActive: IconAssetsActive,
    isComing: false,
    requireActivated: false,
  },
  {
    title: 'Activity',
    href: '/activity',
    icon: IconActivity,
    iconActive: IconActivityActive,
    isComing: false,
    requireActivated: false,
  },
  // {
  //   title: 'Dapps',
  //   href: "/dapps",
  //   icon: IconDapps,
  //   iconActive: IconDappsActive,
  //   isComing: true,
  // },
  {
    title: 'Settings',
    href: '/security',
    icon: IconSettings,
    iconActive: IconSettingsActive,
    isComing: false,
    requireActivated: true,
  },
];

export const passkeyTooltipText =
  'A passkey is a FIDO credential stored on your computer or phone, and it is used to unlock your online accounts. The passkey makes signing in more secure.';

export const forbiddenEmailProviders = ['qq.com', '163.com', '126.com'];

// export const validEmailDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'proton.me', 'protonmail.com'];

export const validEmailProviders = [
  {
    icon: IconEmailGmail,
    title: 'Gmail',
    domain: 'gmail.com',
  },
  {
    icon: IconEmailOutlook,
    title: 'Outlook',
    domain: 'outlook.com',
  },
  {
    icon: IconEmailYahoo,
    title: 'Yahoo mail',
    domain: 'yahoo.com',
  },
  {
    icon: IconEmailIcloud,
    title: 'Icloud',
    domain: 'icloud.com',
  },
  {
    icon: IconEmailProton,
    title: 'Pronton',
    domain: 'proton.me',
  },
];

const extraEmailProviders = ['protonmail.com'];

export const validEmailDomains = [validEmailProviders.map((provider) => provider.domain), ...extraEmailProviders];
