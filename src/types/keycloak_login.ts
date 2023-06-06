export interface KeycloakLogin {
  access_token: string;
  expires_in: number;
  refreshExpiresIn: string;
  refresh_token: string;
  scope: string;
  session_state: string;
  token_type: string;
}
