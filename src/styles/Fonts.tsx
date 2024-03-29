import { Global } from '@emotion/react';
// import NunitoRegular from '@/assets/fonts/Nunito/Nunito-Regular.ttf';
// import NunitoSemiBold from '@/assets/fonts/Nunito/Nunito-SemiBold.ttf';
// import NunitoBold from '@/assets/fonts/Nunito/Nunito-Bold.ttf';
// import NunitoExtraBold from '@/assets/fonts/Nunito/Nunito-ExtraBold.ttf';
import SfRegular from '@/assets/fonts/sf/SF-Pro-Text-Regular.otf';
import SfSemiBold from '@/assets/fonts/sf/SF-Pro-Text-Semibold.otf';
import SfBold from '@/assets/fonts/sf/SF-Pro-Text-Bold.otf';
// import SfExtraHeavy from '@/assets/fonts/sf/SF-Pro-Text-Heavy.otf';

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
 `}
  />
);

export default Fonts;
