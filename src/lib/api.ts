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
  saveKey: (params: any) => axio.post('/authenticated/save-key-info', params),
  getKey: (params: any) => axio.post('/authenticated/get-key-info', params),
  saveGuardianInfo: (params: any) => axio.post('/authenticated/save-guardian-info', params),
  getGuardianInfo: (params: any) => axio.post('/authenticated/get-guardian-info', params),
}

const auth = {
  challenge: (params: any) => axio.post('/auth/challenge', params),
  getJwt: (params: any) => axio.post('/auth/token', params),
}

const account = {
  create: (params: any) => axio.post('/account/create', params),
  list: (params: any) => axio.post('/account/list', params),
  nameStatus: (params: any) => axio.post('/account/name-status', params),
};

const backup = {
  publicBackupCredentialId: (params: any) => axio.post('/backup/public-backup-credential-id', params),
  credential: (params: any) => axio.get('/backup/credential', { params }),
};

const sponsor = {
  check: (chainID: string, entryPoint: string, op: UserOperation) =>
    axio.post('/sponsor/sponsor-op', {
      chainID,
      entryPoint,
      op,
    }),
};

const invitation = {
  codeStatus: (params: any) => axio.post('/invitation/code-status', params),
}

const token = {
  interest: (params: any) => axio.post('/token/interest',params),
  balance: (params: any) => axio.post('/token/ft',params),
  history: (params: any) => axio.post('/token/history',params),
  spendTrialInterest: (params: any) => axio.post('/token/spend-trial-interest',params),
}

const aave = {
  apy: (params: any) => axios.get(`${vaultsFyiEndpoint}/vaults/${params.network}/${params.vaultAddress}/apy`, {params,
  }),
}

export default {
  auth,
  authenticated,
  account,
  sponsor,
  backup,
  token,
  aave,
  invitation,
};
