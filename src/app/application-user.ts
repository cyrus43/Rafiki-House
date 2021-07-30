export interface ApplicationUser extends Partial<any> {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  groups: any[];
  device_details: {
    device: string;
  };
  is_active: boolean;
  language: string;
  user_timezone: string;
  universe: 1;
  access_token: string;
  is_subject: boolean;
  permissions: any[];
  referral_code: string;
  name: string;
  project: any;
  approver_level: string;
  universe_name: string;
  is_verified: boolean;
  subject: number;
}
