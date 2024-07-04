import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import Header from '@/components/mobile/Header';
import usePasskey from '@/hooks/usePasskey';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import Intro from './Intro';
import SetUsername from './SetUsername';
import SetPasskey from './SetPasskey';
import RecoverProgress from './RecoverProgress';
import RecoverSuccess from './RecoverSuccess';
import api from '@/lib/api';
import { useTempStore } from '@/store/temp';
import { SocialRecovery } from '@soulwallet/sdk';
import { useSettingStore } from '@/store/setting';
import useWallet from '@/hooks/useWallet';
import useQuery from '@/hooks/useQuery';
import RecoverProcess from './RecoverProcess';
import useScreenSize from '@/hooks/useScreenSize'

export default function Recover() {
  const { registerForRecover } = usePasskey();
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(-1);
  const [username, setUsername] = useState('');
  const [addingPasskey, setAddingPasskey] = useState(false);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [isWalletNotFound, setIsWalletNotFound] = useState(false);
  const { boostAfterRecovered } = useWallet();
  const { fetchPublicGuardianInfo } = useQuery();
  const [timer, setTimer] = useState<any>();
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [signedGuardians, setSignedGuardians] = useState<any>([]);
  const { innerHeight } = useScreenSize()

  const { recoverInfo, updateRecoverInfo } = useTempStore();
  const { recoveryID } = recoverInfo;

  const debounce = (fn: Function, delay: number) => {
    clearTimeout(timer);
    setTimer(setTimeout(fn, delay));
  };

  const onPrev = useCallback(() => {
    if (step >= 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  }, [step]);

  const onNext = useCallback(() => {
    console.log('next');
    setStep(step + 1);
  }, [step]);

  const onCreatePasskey = async () => {
    try{
      setAddingPasskey(true);
      // create credential
      const credential = await registerForRecover(accountInfo.name);
      // create recover record
      try {
        const createRecordRes = await api.recovery.createRecord({
          chainID: accountInfo.chainID,
          address: accountInfo.address,
          newOwners: [credential.onchainPublicKey],
        });
        await fetchPublicGuardianInfo(accountInfo.address);
        updateRecoverInfo({
          recoveryID: createRecordRes.data.recoveryID,
          credential,
        });
        setStep(2);
      } catch (err: any) {
        console.log('createerrrrr', err);
        toast({
          title: 'Error',
          description: err.response.data.msg,
          status: 'error',
        });
      } finally {
        setAddingPasskey(false);
      }
    }catch(err){
      setAddingPasskey(false);
    }
  };

  const checkUsername = async () => {
    // todo, add debounce;
    if (!username) return;
    // clear Previous info
    // setCheckingUsername(true);
    setAccountInfo(null);
    setIsWalletNotFound(false);

    try {
      // check username or wallet address
      const usernameRes: any = await api.account.get({
        name: username,
      });

      if (usernameRes.code === 200) {
        console.log('matched');
        setAccountInfo(usernameRes.data);
        setIsWalletNotFound(false);
        setCheckingUsername(false);
      }
    } catch (err: any) {
      try {
        const addressRes: any = await api.account.get({
          address: username,
        });

        if (addressRes.code === 200) {
          console.log('matched');
          setAccountInfo(addressRes.data);
          setIsWalletNotFound(false);
          setCheckingUsername(false);
        }
      } catch (err) {
        setIsWalletNotFound(true);
        setAccountInfo(null);
      }
    } finally {
      setCheckingUsername(false);
    }
  };

  useEffect(() => {
    if(!username) return
    setCheckingUsername(true);
    debounce(() => {
      checkUsername();
    }, 1000);
  }, [username]);

  const doRecover = async () => {
    try {
      while (true) {
        setIsRecovering(true);
        const res: any = await api.recovery.execute({ recoveryID });
        if (res.msg === 'executeRecovery tirggered' || res.msg === 'recovery already executed') {
          const recoverRecord = await getPreviousRecord();
          await boostAfterRecovered(recoverRecord);
          // todo, need to get jwt again
          navigate('/landing');
          break;
        }
      }
    } catch (err: any) {
      setIsRecovering(false);
      toast({
        title: 'Error',
        description: err.response.data.msg,
        status: 'error',
      });
    }
  };

  const getPreviousRecord = async () => {
    try {
      const recoveryRecordRes = await api.recovery.getRecord({
        recoveryID,
      });

      updateRecoverInfo({
        ...recoveryRecordRes.data,
      });

      if (recoveryRecordRes.data.guardianSignatures) {
        setSignedGuardians(recoveryRecordRes.data.guardianSignatures.map((item: any) => item.guardian));
      }

      const status = recoveryRecordRes.data.status;

      if (status == 0) {
        // record submitted
        setStep(2);
      } else if (status == 1) {
        // signatured gathered
        setStep(3);
      }

      return recoveryRecordRes.data;
    } catch (error: any) {
      console.log('error', error.message);
    }
  };

  useEffect(() => {
    if (recoveryID) {
      getPreviousRecord();
      const interval = setInterval(async () => {
        getPreviousRecord();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [recoveryID]);

  const renderStep = () => {
    if (step == -1) {
      return <Intro onPrev={onPrev} onNext={onNext} />;
    } else if (step == 0) {
      return (
        <SetUsername
          onPrev={onPrev}
          isWalletNotFound={isWalletNotFound}
          onNext={onNext}
          accountInfo={accountInfo}
          username={username}
          checking={checkingUsername}
          setUsername={setUsername}
        />
      );
    } else if (step == 1) {
      return <SetPasskey onPrev={onPrev} onNext={onCreatePasskey} addingPasskey={addingPasskey} />;
    } else if (step == 2) {
      return <RecoverProgress onNext={onNext} signedGuardians={signedGuardians} />;
    } else if (step == 3) {
      return <RecoverSuccess isRecovering={isRecovering} doRecover={doRecover} />;
    }

    return null;
  };

  return (
    <Box width="100%" height="100%" bg="#fff">
      {step < 4 && (
        <Fragment>
          {step === -1 && <Header title="" showLogo={true} />}
          {step > -1 && <Header title={step < 3 ? 'Recover account' : ''} showBackButton={step < 3} step={step} onBack={onPrev} />}
        </Fragment>
      )}
      {step > -1 && step < 3 && <ProgressBar size={3} activeIndex={step} />}
      {step > -1 && step < 3 && <RecoverProcess step={step} />}
      <Box
        height={(step < 4) ? (innerHeight - 64) : innerHeight}
        overflowY="auto"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
      >
        {renderStep()}
      </Box>
    </Box>
  );
}
