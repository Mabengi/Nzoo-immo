export interface Database {
  public: {
    Tables: {
      reservations: {
        Row: {
          id: string;
          fullname: string;
          email: string;
          phone: string;
          company: string | null;
          activity: string;
          address: string | null;
          spacetype: string;
          startdate: string;
          enddate: string;
          occupants: number;
          subscriptiontype: string;
          amount: number;
          paymentmethod: string;
          transactionid: string;
          status: string;
          createdat: string;
          updatedat: string;
        };
        Insert: {
          id?: string;
          fullname: string;
          email: string;
          phone: string;
          company?: string | null;
          activity: string;
          address?: string | null;
          spacetype: string;
          startdate: string;
          enddate: string;
          occupants: number;
          subscriptiontype: string;
          amount: number;
          paymentmethod: string;
          transactionid: string;
          status?: string;
          createdat?: string;
          updatedat?: string;
        };
        Update: {
          id?: string;
          fullname?: string;
          email?: string;
          phone?: string;
          company?: string | null;
          activity?: string;
          address?: string | null;
          spacetype?: string;
          startdate?: string;
          enddate?: string;
          occupants?: number;
          subscriptiontype?: string;
          amount?: number;
          paymentmethod?: string;
          transactionid?: string;
          status?: string;
          createdat?: string;
          updatedat?: string;
        };
      };
    };
    Functions: {
      create_reservation_admin: {
        Args: {
          reservation_data: Json;
        };
        Returns: Json;
      };
    };
  };
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];