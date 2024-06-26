import { Global } from '@emotion/react';
import SfRegular from '@/assets/fonts/sf/SF-Pro-Text-Regular.otf';
import SfSemiBold from '@/assets/fonts/sf/SF-Pro-Text-Semibold.otf';
import SfMedium from '@/assets/fonts/sf/SF-Pro-Text-Medium.otf';
import SfBold from '@/assets/fonts/sf/SF-Pro-Text-Bold.otf';

import InterRegular from '@/assets/fonts/inter/Inter-Regular.ttf';
import InterMedium from '@/assets/fonts/inter/Inter-Medium.ttf';
import InterSemiBold from '@/assets/fonts/inter/Inter-SemiBold.ttf';
import InterBold from '@/assets/fonts/inter/Inter-Bold.ttf';

import SohneRegular from '@/assets/fonts/Sohne/regular.otf';
import SohneMedium from '@/assets/fonts/Sohne/medium.otf';

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
        font-weight: 500;
        src: url(${SfMedium});
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
      font-weight: 500;
      src: url(${InterMedium});
    }
       @font-face {
      font-family: 'Inter';
      font-weight: 600;
      src: url(${InterSemiBold});
    }
    @font-face {
      font-family: 'Inter';
      font-weight: 700;
      src: url(${InterBold});
    }

    @font-face {
      font-family: 'Sohne';
      font-weight: 400;
      src: url(${SohneRegular});
    }

      @font-face {
      font-family: 'Sohne';
      font-weight: 500;
      src: url(${SohneMedium});
    }
 `}
  />
);

export default Fonts;
