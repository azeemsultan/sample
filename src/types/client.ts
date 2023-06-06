export interface Client {
  client_id?: string;
  name?: string;
  email?: string;
  city?: string;
  country?: string;
  logo?: string;
  password?: string;
  user?: any;
  account_id?: number;
  api_3scale_id?: number;
  focal_user_id?: number;
  application_id?: number;
  total_device?: number;
  deviceTotalCount?: number;
  allow_customization?: boolean;
  color_schema?: boolean;
  created_at?: number;
  is_activated?: number;
  submit?: string;
}

export interface ClientList {
  client_client_id?: string;
  client_name?: string;
  client_email?: string;
  client_city?: string;
  client_country?: string;
  deviceTotalCount?: string;
  client_user?: any;
  client_focal_user_id?: number;
  client_total_device?: number;
  client_created_at?: number;
  client_is_activated?: number;
  submit?: string;
}

export interface ClientOverviewProps {
  data: ClientList[];
  totalCount: number;
}

export interface ClientDetailProps {
  client: Client;
}

export interface ClientDeleteProps {
  clientsList: string[];
  openDeleteModal: boolean;
  setOpenDeleteModal: (boolean) => void;
}
