import { Global } from '@emotion/react';
import SfRegular from '@/assets/fonts/sf/SF-Pro-Text-Regular.otf';
import SfSemiBold from '@/assets/fonts/sf/SF-Pro-Text-Semibold.otf';
import SfBold from '@/assets/fonts/sf/SF-Pro-Text-Bold.otf';

import InterRegular from '@/assets/fonts/inter/Inter-Regular.ttf';
import InterBold from '@/assets/fonts/inter/Inter-Bold.ttf';

const Fonts = () => (
  <Global
    styles={`
    @font-face {
        font-family: 'SF';
        font-weight: 400;
        src: url(${SfRegular});
    }
    @font-face {
      font-family: 'SF';
      font-weight: 600;
      src: url(${SfSemiBold});
    }
    @font-face {
      font-family: 'SF';
      font-weight: 700;
      src: url(${SfBold});
    }
    @font-face {
      font-family: 'Inter';
      font-weight: 400;
      src: url(${InterRegular});
    }
    @font-face {
      font-family: 'Inter';
      font-weight: 700;
      src: url(${InterBold});
    }
 `}
  />
);

export default Fonts;
