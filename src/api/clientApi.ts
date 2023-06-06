import type { Client, ClientOverviewProps } from 'src/types/client';

import axios from 'src/utils/axios';
import parse from 'src/utils/parse';
import { isUndefined } from 'lodash';
import logger from 'src/utils/logger';
import i18next from 'i18next';

class ClientApi {
  async create(client: Client): Promise<Client> {
    return new Promise((resolve, reject) => {
      delete client?.submit;
      // Create Client
      axios.post(`${process.env.REACT_APP_CLIENTS_URL}`, client).then((response) => {
        response = parse(response);
        if (!isUndefined(response?.data)) {
          const data = response?.data;
          resolve(data);
        }
      }).catch((err) => {
        logger(err, 'error');
        reject(err);
      });
    });
  }

  async edit(client: Client): Promise<Client> {
    return new Promise((resolve, reject) => {
      delete client?.submit;
      if (client?.password?.trim()?.length === 0) {
        delete client?.password;
      }
      // Update Client
      axios.put(`${process.env.REACT_APP_CLIENTS_URL}/${client?.client_id}`, client).then((response) => {
        response = parse(response);
        if (!isUndefined(response?.data)) {
          const data = response?.data;
          resolve(data);
        }
      }).catch((err) => {
        logger(err, 'error');
        reject(err);
      });
    });
  }

  async getAllClientAutoComplete(search: string): Promise<Client[]> {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_CLIENTS_URL}/getAllClientAutoComplete`, {
        search
      }).then((response) => {
        response = parse(response);
        if (!isUndefined(response?.data)) {
          const res = response?.data?.data;
          resolve(res);
        } else {
          reject(new Error(i18next.t('invalid_server_response')));
        }
      }).catch((error) => {
        logger(error, 'error');
        reject(new Error(i18next.t('internal_server_error')));
      });
    });
  }

  async getAll(page: number, limit: number, currentTab: string, search: string, sortColumn: any, sortDirection: boolean): Promise<ClientOverviewProps> {
    return new Promise((resolve, reject) => {
      // Get By Id Client

      let sortList = {};
      if (sortColumn.name) {
        sortList = {
          'client.name': sortDirection ? 'ASC' : 'DESC',
          'client.email': sortDirection ? 'ASC' : 'DESC',
        };
      }

      if (sortColumn.address) {
        sortList = {
          'client.city': sortDirection ? 'ASC' : 'DESC',
          'client.country': sortDirection ? 'ASC' : 'DESC',
        };
      }

      if (sortColumn.is_activated) {
        sortList = {
          'client.is_activated': sortDirection ? 'ASC' : 'DESC',
        };
      }

      if (sortColumn.created_at) {
        sortList = {
          'client.created_at': sortDirection ? 'ASC' : 'DESC',
        };
      }

      if (sortColumn.total_devices) {
        sortList = {
          deviceTotalCount: sortDirection ? 'ASC' : 'DESC',
        };
      }

      const filter: any = {
        page,
        limit,
        sortList
      };

      let data: any;

      if (Object.keys(sortList)?.length === 0) {
        delete filter.sortList;
      }

      if (search?.length > 0) {
        data = {
          Filter: filter,
          search
        };
      } else {
        data = {
          Filter: filter,
        };
      }

      if (!isUndefined(currentTab)) {
        if (+currentTab !== -1) {
          filter.active = !!currentTab;
        }
      }

      axios.post(`${process.env.REACT_APP_CLIENTS_URL}/getAllClient`, data).then((response) => {
        response = parse(response);
        if (!isUndefined(response?.data)) {
          const res = response?.data;
          resolve(res);
        } else {
          reject(new Error(i18next.t('invalid_server_response')));
        }
      }).catch((error) => {
        logger(error, 'error');
        reject(new Error(i18next.t('internal_server_error')));
      });
    });
  }

  async getById(clientId: number): Promise<Client> {
    return new Promise((resolve, reject) => {
      // Get By Id Client
      axios.get(`${process.env.REACT_APP_CLIENTS_URL}/${clientId}`).then((response) => {
        response = parse(response);
        if (!isUndefined(response?.data)) {
          const data = response?.data;
          resolve(data);
        } else {
          reject(new Error(i18next.t('invalid_server_response')));
        }
      }).catch((error) => {
        logger(error, 'error');
        reject(new Error(i18next.t('internal_server_error')));
      });
    });
  }

  async deActivate(clientId: string, isActive: number): Promise<Client> {
    return new Promise((resolve, reject) => {
      // De-active Client
      axios.patch(`${process.env.REACT_APP_CLIENTS_URL}/delete/${clientId}`, {
        is_activated: !isActive
      }).then((response) => {
        response = parse(response);
        if (!isUndefined(response?.data)) {
          const data = response?.data;
          resolve(data);
        } else {
          reject(new Error(i18next.t('invalid_server_response')));
        }
      }).catch((error) => {
        logger(error, 'error');
        reject(new Error(i18next.t('internal_server_error')));
      });
    });
  }

  async bulkDeActivate(clientIds: string[]): Promise<Client> {
    return new Promise((resolve, reject) => {
      // Bulk De-active Clients
      axios.post(`${process.env.REACT_APP_CLIENTS_URL}/bulk_deactive`, {
        list: clientIds
      }).then((response) => {
        response = parse(response);
        if (!isUndefined(response?.data)) {
          const data = response?.data;
          resolve(data);
        } else {
          reject(new Error(i18next.t('invalid_server_response')));
        }
      }).catch((error) => {
        logger(error, 'error');
        reject(new Error(i18next.t('internal_server_error')));
      });
    });
  }

  async updateClientLogo(clientId: string, logo: string, allowCustomization: boolean): Promise < any > {
    // Update Profile Image By Keycloak Id
    return new Promise((resolve, reject) => {
      axios.patch(`${process.env.REACT_APP_CLIENTS_URL}/updateClientLogo/${clientId}`, {
        logo,
        allow_customization: allowCustomization
      }).then((response) => {
        response = parse(response);
        if (!isUndefined(response)) {
          const res = response?.data;
          resolve(res);
        } else {
          reject(new Error(i18next.t('invalid_server_response')));
        }
      }).catch((error) => {
        logger(error, 'error');
        reject(new Error(i18next.t('internal_server_error')));
      });
    });
  }

  async updateColorSchema(clientId: string, colorSchema: object, allowCustomization: boolean): Promise<any> {
    // Update Profile Image By Keycloak Id
    return new Promise((resolve, reject) => {
      axios.patch(`${process.env.REACT_APP_CLIENTS_URL}/updateColorSchema/${clientId}`, {
        color_schema: colorSchema,
        allow_customization: allowCustomization
      }).then((response) => {
        response = parse(response);
        if (!isUndefined(response)) {
          const res = response?.data;
          resolve(res);
        } else {
          reject(new Error(i18next.t('invalid_server_response')));
        }
      }).catch((error) => {
        logger(error, 'error');
        reject(new Error(i18next.t('internal_server_error')));
      });
    });
  }

  async get3ScaleUserById(client: Client): Promise<any> {
    // get 3 scale user by id
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.REACT_APP_CLIENTS_URL}/account/accountRead/${client?.account_id}`).then((response) => {
        response = parse(response);
        if (!isUndefined(response)) {
          const res = response?.data;
          resolve(res);
        } else {
          reject(new Error(i18next.t('invalid_server_response')));
        }
      }).catch((error) => {
        logger(error, 'error');
        reject(new Error(i18next.t('internal_server_error')));
      });
    });
  }

  async approve3ScaleAccount(client: Client): Promise <any> {
    // Approve API Key
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_CLIENTS_URL}/accountApprove?account_id=${client?.account_id}&client_id=${client?.client_id}`).then((response) => {
        response = parse(response);
        if (!isUndefined(response)) {
          const res = response?.data;
          resolve(res);
        } else {
          reject(new Error(i18next.t('invalid_server_response')));
        }
      }).catch((error) => {
        logger(error, 'error');
        reject(new Error(i18next.t('internal_server_error')));
      });
    });
  }

  async unApprove3ScaleAccount(client: Client): Promise<any> {
    // Un Approve API Key
    return new Promise((resolve, reject) => {
      axios.put(`${process.env.REACT_APP_CLIENTS_URL}/accountDelete/${client?.account_id}`).then((response) => {
        response = parse(response);
        if (!isUndefined(response)) {
          const res = response?.data;
          resolve(res);
        } else {
          reject(new Error(i18next.t('invalid_server_response')));
        }
      }).catch((error) => {
        logger(error, 'error');
        reject(new Error(i18next.t('internal_server_error')));
      });
    });
  }

  async generateAPIKey(client: Client): Promise <any> {
    // Approve API Key
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_CLIENTS_URL}/createApplicationKey?application_id=${client?.application_id}&account_id=${client?.account_id}`).then((response) => {
        response = parse(response);
        if (!isUndefined(response)) {
          const res = response?.data;
          resolve(res);
        } else {
          reject(new Error(i18next.t('invalid_server_response')));
        }
      }).catch((error) => {
        logger(error, 'error');
        reject(error);
      });
    });
  }

  async getApplicationKeyList(client: Client): Promise<any> {
    // Get Application Key List
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_CLIENTS_URL}/applicationKeyList?application_id=${client?.application_id}&account_id=${client?.account_id}`).then((response) => {
        response = parse(response);
        if (!isUndefined(response)) {
          const res = response?.data;
          resolve(res);
        } else {
          reject(new Error(i18next.t('invalid_server_response')));
        }
      }).catch((error) => {
        logger(error, 'error');
        reject(new Error(i18next.t('internal_server_error')));
      });
    });
  }

  async getApplicationById(client: Client): Promise<any> {
    // Get Application By Id
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.REACT_APP_CLIENTS_URL}/application/applicationRead?application_id=${client?.application_id}&account_id=${client?.account_id}`).then((response) => {
        response = parse(response);
        if (!isUndefined(response)) {
          const res = response?.data;
          resolve(res);
        } else {
          reject(new Error(i18next.t('invalid_server_response')));
        }
      }).catch((error) => {
        logger(error, 'error');
        reject(new Error(i18next.t('internal_server_error')));
      });
    });
  }

  async applicationSuspend(client: Client): Promise<any> {
    // Application Suspend
    return new Promise((resolve, reject) => {
      axios.put(`${process.env.REACT_APP_CLIENTS_URL}/application/applicationSuspend?application_id=${client?.application_id}&account_id=${client?.account_id}`).then((response) => {
        response = parse(response);
        if (!isUndefined(response)) {
          const res = response?.data;
          resolve(res);
        } else {
          reject(new Error(i18next.t('invalid_server_response')));
        }
      }).catch((error) => {
        logger(error, 'error');
        reject(error);
      });
    });
  }

  async applicationResume(client: Client): Promise<any> {
    // Application Resume
    return new Promise((resolve, reject) => {
      axios.put(`${process.env.REACT_APP_CLIENTS_URL}/application/applicationResume?application_id=${client?.application_id}&account_id=${client?.account_id}`).then((response) => {
        response = parse(response);
        if (!isUndefined(response)) {
          const res = response?.data;
          resolve(res);
        } else {
          reject(new Error(i18next.t('invalid_server_response')));
        }
      }).catch((error) => {
        logger(error, 'error');
        reject(error);
      });
    });
  }
}

export const clientApi = new ClientApi();
