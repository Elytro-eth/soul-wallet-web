import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet';

const ThemePage = ({ themeColor, children }: { themeColor: string; children: ReactNode }) => {
  return (
    <div>
      <Helmet>
        <meta name="theme-color" content={themeColor} />
      </Helmet>
      {children}
    </div>
  );
};

export default ThemePage;
