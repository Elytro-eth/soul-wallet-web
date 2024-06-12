import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import Header from '@/components/mobile/Header';
import usePasskey from '@/hooks/usePasskey';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar'
import Intro from './Intro'
import SetUsername from './SetUsername'
import SetPasskey from './SetPasskey'
import RecoverProgress from './RecoverProgress'
import RecoverSuccess from './RecoverSuccess'
import api from '@/lib/api';
import { useTempStore } from '@/store/temp';


export default function Recover() {
  const { registerForRecover } = usePasskey();
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  // const [credential, setCredential] = useState<any>(null);
  const [addingPasskey, setAddingPasskey] = useState(false);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const { recoverInfo, setRecoverInfo } = useTempStore();
  const { recoveryId } = recoverInfo;

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

  // const onSkip = useCallback(() => {
  //   console.log('skip');
  // }, []);

  const onCreatePasskey = async()=>{
    setAddingPasskey(true);
    // create credential
    const credential = await registerForRecover(accountInfo.name)
    // create recover record
    try{
      const createRecordRes = await api.recovery.createRecord({
        chainID: accountInfo.chainID,
        address: accountInfo.address,
        newOwners: [credential.onchainPublicKey]
      })
      console.log('createRecordRes', createRecordRes);
      setStep(3);
    }catch(err:any){
      console.log('createerrrrr', err)
      toast({
        title: 'Error',
        description: err.response.data.msg,
        status: 'error',
      })
    }finally{
      setAddingPasskey(false);
    }
  }

  const checkUsername = async()=>{
    // todo, add debounce;
    if( !username ) return;
    // check username or wallet address
    const usernameRes:any = await api.account.get({
      name: username,
    });

    if(usernameRes.code === 200){
      console.log('matched')
      setAccountInfo(usernameRes.data);
      return;
    }

    const addressRes:any = await api.account.get({
      address: username,
    });


    if(addressRes.code === 200){
      console.log('matched')
      setAccountInfo(addressRes.data);
    }

  }

  useEffect(()=>{
    checkUsername();
  }, [username])

  const getPreviousRecord = async () => {
    try {
      const recoveryRecord = await api.recovery.getRecord({
        recoveryID: recoveryId,
      })

      setRecoverInfo({
        recoveryId: recoveryId,
        ...recoveryRecord,
      });

      const status = recoveryRecord.status;

      if (status == 0) {
        // record submitted
        setStep(3);
      } else if (status == 1) {
        // signatured gathered
        setStep(4);
      }
    } catch (error: any) {
      console.log('error', error.message);
    }
  };

  useEffect(() => {
    if (recoveryId) {
      getPreviousRecord();
      const interval = setInterval(async () => {
        getPreviousRecord();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [recoveryId]);

  const renderStep = () => {
    if (step == 0) {
      return (
        <Intro onPrev={onPrev} onNext={onNext} />
      )
    } else if (step == 1) {
      return (
        <SetUsername onPrev={onPrev} onNext={onNext} accountInfo={accountInfo} username={username} setUsername={setUsername} />
      )
    } else if (step == 2) {
      return (
        <SetPasskey onPrev={onPrev} onNext={onCreatePasskey} addingPasskey={addingPasskey} />
      )
    } else if (step == 3) {
      return (
        <RecoverProgress onNext={onNext} />
      )
    } else if (step == 4) {
      return (
        <RecoverSuccess onNext={onNext} />
      )
    }

    return null
  };

  return (
    <Box width="100%" height="100%">
      {step < 4 && (
        <Fragment>
          {step === 0 && (
            <Header title="" showLogo={true} />
          )}
          {step > 0 && (
            <Header title="Recover account" showBackButton onBack={onPrev} />
          )}
        </Fragment>
      )}
      {renderStep()}
    </Box>
  );
}
