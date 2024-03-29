import axios from 'axios';
import config from '@/config';
import { UserOperation } from '@soulwallet/sdk';
import { vaultsFyiEndpoint } from '@/config/constants';

const axio = axios.create({
  baseURL: config.backendURL,
});

axio.interceptors.response.use((res: any) => {
  if (res.data.code !== 200) {
    // TODO, wrap API and useToast
    console.error(res.data.msg);
    // toast.error(res.data.msg);
  }
  return res.data;
});

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
  check: (chainId: string, entryPoint: string, op: UserOperation) =>
    axio.post('/sponsor/sponsor-op', {
      chainId,
      entryPoint,
      op,
    }),
};

const invitation = {
  codeStatus: (params: any) => axio.post('/invitation/code-status', params),
}

const token = {
  interest: (params: any) => axio.post('/token/interest',params),
  balance: (params: any) => axio.post('/token/balance',params),
  history: (params: any) => axio.post('/token/history',params),
}

const aave = {
  apy: (params: any) => axios.get(`${vaultsFyiEndpoint}/vaults/${params.network}/${params.vaultAddress}/apy`, {params,
  }),
}

export default {
  account,
  sponsor,
  backup,
  token,
  aave,
  invitation,
};
