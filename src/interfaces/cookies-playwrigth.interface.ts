export interface CookiesInterfacePlaywright {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "None" | "Strict" | "Lax";
}
