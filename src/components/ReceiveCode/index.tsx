import { useState, useEffect } from 'react';
import useTools from '@/hooks/useTools';
import { Image, BoxProps } from '@chakra-ui/react';

interface IReceiveCode extends BoxProps {
  address: string;
  onSet: (qrcode: string) => void;
}

export default function ReceiveCode({ address, onSet, width, height }: IReceiveCode) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const { generateQrCode } = useTools();
  const generateQR = async (text: string) => {
    try {
      const qrImg = await generateQrCode(text);
      setImgSrc(qrImg);
      onSet(qrImg);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!address) {
      return;
    }
    generateQR(address);
  }, [address]);

  return <Image src={imgSrc} mx="auto" display={'block'} w={width || '200px'} h={height || '200px'} />;
}
