import axios from 'axios';
import config from '@/config';
import { UserOperation } from '@soulwallet/sdk';
import { vaultsFyiEndpoint } from '@/config/constants';

const axio = axios.create({
  baseURL: config.backendURL,
});

// add token for each request
axio.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

axio.interceptors.response.use((res: any) => {
  if (res.data.code !== 200) {
    // TODO, wrap API and useToast
    console.error(res.data.msg);
    // toast.error(res.data.msg);
  }
  return res.data;
});

const authenticated = {
  saveKey: (params: any) => axio.post('/walletapi/authenticated/save-key-info', params),
  getKey: (params: any) => axio.post('/walletapi/authenticated/get-key-info', params),
  saveGuardianInfo: (params: any) => axio.post('/walletapi/authenticated/save-guardian-info', params),
  getGuardianInfo: (params: any) => axio.post('/walletapi/authenticated/get-guardian-info', params),
}

const auth = {
  challenge: (params: any) => axio.post('/walletapi/auth/challenge', params),
  getJwt: (params: any) => axio.post('/walletapi/auth/token', params),
}

const account = {
  create: (params: any) => axio.post('/walletapi/account/create', params),
  get: (params: any) => axio.post('/walletapi/account/get-account', params),
  // list: (params: any) => axio.post('/walletapi/account/list', params),
  nameStatus: (params: any) => axio.post('/walletapi/account/name-status', params),
};

const backup = {
  publicBackupGuardians: (params: any) => axio.post('/walletapi/backup/public-backup-guardians', params),
  publicGetGuardians: (params: any) => axio.get('/walletapi/backup/guardian-info', {params}),
  publicBackupCredentialId: (params: any) => axio.post('/walletapi/backup/public-backup-credential-id', params),
  credential: (params: any) => axio.get('/walletapi/backup/credential', { params }),
};

const recovery = {
  createRecord: (params: any) => axio.post('/walletapi/social-recovery/create-recovery-record', params),
  getRecord: (params: any) => axio.post('/walletapi/social-recovery/record', params),
  guardianSign: (params: any) => axio.post('/walletapi/social-recovery/guardian-sign', params),
  execute: (params: any) => axio.post('/walletapi/social-recovery/execute', params),
}


const sponsor = {
  check: (chainID: string, entryPoint: string, op: UserOperation) =>
    axio.post('/walletapi/sponsor/sponsor-op', {
      chainID,
      entryPoint,
      op,
    }),
    leftTimes: (params: any) => axio.post('/walletapi/sponsor/sponsor-op-check', params),
};

const invitation = {
  codeStatus: (params: any) => axio.post('/walletapi/invitation/code-status', params),
}

const token = {
  interest: (params: any) => axio.post('/walletapi/token/interest',params),
  balance: (params: any) => axio.post('/walletapi/token/ft',params),
  spendTrialInterest: (params: any) => axio.post('/walletapi/token/spend-trial-interest',params),
}

const op = {
  list: (walletAddress: string, chainId: string[]) =>
    axio.post('/opapi/op/search', {
      walletAddress,
      chainIDs: chainId,
    }),
  detail: (opHash: string) =>
    axio.post('/opapi/op', {
      opHash,
    }),
};

const emailVerify = {
  requestVerifyEmail: (params: any) => axio.post('walletapi/email-verify/request-verify-email', params),
  confirmVerification: (params: any) => axio.post('walletapi/email-verify/confirm-verification', params),
  verificationStatus: (params: any) => axio.post('walletapi/email-verify/verification-status', params),
}

const emailGuardian = {
  allocateGuardian: (params: any) => axio.post('walletapi/email-guardian/allocate-guardian', params),
  // guardianInfo: (params: any) => axio.post('/email-guardian/guardian-info', params),
  emailTemplate: (params: any) => axio.post('walletapi/email-guardian/email-template', params),
}

export default {
  auth,
  authenticated,
  account,
  sponsor,
  backup,
  token,
  invitation,
  op,
  emailVerify,
  emailGuardian,
  recovery,
};
