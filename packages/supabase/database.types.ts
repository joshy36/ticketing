export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      artists: {
        Row: {
          created_at: string
          created_by: string
          description: string
          id: string
          image: string | null
          name: string
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          id?: string
          image?: string | null
          name: string
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          image?: string | null
          name?: string
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "artists_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artists_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_members: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          last_read: string | null
          user_id: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          last_read?: string | null
          user_id: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          last_read?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_members_chat_id_fkey"
            columns: ["chat_id"]
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_members_last_read_fkey"
            columns: ["last_read"]
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_messages: {
        Row: {
          chat_id: string
          content: string | null
          created_at: string
          from: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          chat_id: string
          content?: string | null
          created_at?: string
          from?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          chat_id?: string
          content?: string | null
          created_at?: string
          from?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_from_fkey"
            columns: ["from"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      chats: {
        Row: {
          chat_type: Database["public"]["Enums"]["chat_type"]
          created_at: string
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          chat_type: Database["public"]["Enums"]["chat_type"]
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          chat_type?: Database["public"]["Enums"]["chat_type"]
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      collectibles: {
        Row: {
          base_url: string | null
          created_at: string
          etherscan_link: string | null
          event_id: string | null
          id: string
          ipfs_image: string | null
          ticket_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          base_url?: string | null
          created_at?: string
          etherscan_link?: string | null
          event_id?: string | null
          id?: string
          ipfs_image?: string | null
          ticket_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          base_url?: string | null
          created_at?: string
          etherscan_link?: string | null
          event_id?: string | null
          id?: string
          ipfs_image?: string | null
          ticket_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collectibles_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collectibles_ticket_id_fkey"
            columns: ["ticket_id"]
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collectibles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          artist: string
          base_url: string | null
          created_at: string
          created_by: string
          date: string
          description: string
          etherscan_link: string | null
          id: string
          image: string | null
          ipfs_image: string | null
          max_tickets_per_user: number | null
          name: string
          organization_id: string | null
          stripe_product_id: string | null
          updated_at: string
          venue: string
        }
        Insert: {
          artist: string
          base_url?: string | null
          created_at?: string
          created_by: string
          date: string
          description: string
          etherscan_link?: string | null
          id?: string
          image?: string | null
          ipfs_image?: string | null
          max_tickets_per_user?: number | null
          name: string
          organization_id?: string | null
          stripe_product_id?: string | null
          updated_at?: string
          venue: string
        }
        Update: {
          artist?: string
          base_url?: string | null
          created_at?: string
          created_by?: string
          date?: string
          description?: string
          etherscan_link?: string | null
          id?: string
          image?: string | null
          ipfs_image?: string | null
          max_tickets_per_user?: number | null
          name?: string
          organization_id?: string | null
          stripe_product_id?: string | null
          updated_at?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_artist_fkey"
            columns: ["artist"]
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_fkey"
            columns: ["venue"]
            referencedRelation: "venues"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          created_at: string
          event_id: string | null
          from: string | null
          id: string
          message: string
          status: Database["public"]["Enums"]["message_status"]
          to: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          from?: string | null
          id?: string
          message: string
          status?: Database["public"]["Enums"]["message_status"]
          to?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          from?: string | null
          id?: string
          message?: string
          status?: Database["public"]["Enums"]["message_status"]
          to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_from_fkey"
            columns: ["from"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_to_fkey"
            columns: ["to"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string | null
          role: Database["public"]["Enums"]["role"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["role"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["role"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string
          event_id: string | null
          expiration: string | null
          id: string
          section_id: string | null
          ticket_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          expiration?: string | null
          id?: string
          section_id?: string | null
          ticket_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          expiration?: string | null
          id?: string
          section_id?: string | null
          ticket_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_section_id_fkey"
            columns: ["section_id"]
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_ticket_id_fkey"
            columns: ["ticket_id"]
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      rows: {
        Row: {
          created_at: string
          id: string
          name: string | null
          number_of_seats: number | null
          section_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          number_of_seats?: number | null
          section_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          number_of_seats?: number | null
          section_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rows_section_id_fkey"
            columns: ["section_id"]
            referencedRelation: "sections"
            referencedColumns: ["id"]
          }
        ]
      }
      sbts: {
        Row: {
          base_url: string | null
          created_at: string
          etherscan_link: string | null
          event_id: string | null
          id: string
          ipfs_image: string | null
          ticket_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          base_url?: string | null
          created_at?: string
          etherscan_link?: string | null
          event_id?: string | null
          id?: string
          ipfs_image?: string | null
          ticket_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          base_url?: string | null
          created_at?: string
          etherscan_link?: string | null
          event_id?: string | null
          id?: string
          ipfs_image?: string | null
          ticket_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sbts_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbts_ticket_id_fkey"
            columns: ["ticket_id"]
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      scanners: {
        Row: {
          created_at: string
          event_id: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scanners_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scanners_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      sections: {
        Row: {
          created_at: string
          id: string
          name: string | null
          number_of_rows: number | null
          seats_per_row: number | null
          updated_at: string | null
          venue_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          number_of_rows?: number | null
          seats_per_row?: number | null
          updated_at?: string | null
          venue_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          number_of_rows?: number | null
          seats_per_row?: number | null
          updated_at?: string | null
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sections_venue_id_fkey"
            columns: ["venue_id"]
            referencedRelation: "venues"
            referencedColumns: ["id"]
          }
        ]
      }
      tickets: {
        Row: {
          created_at: string
          event_id: string
          id: string
          price: number
          qr_code: string | null
          scanned: boolean
          seat: string
          section_id: string | null
          stripe_price_id: string | null
          token_id: number | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          price: number
          qr_code?: string | null
          scanned?: boolean
          seat?: string
          section_id?: string | null
          stripe_price_id?: string | null
          token_id?: number | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          price?: number
          qr_code?: string | null
          scanned?: boolean
          seat?: string
          section_id?: string | null
          stripe_price_id?: string | null
          token_id?: number | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_section_id_fkey"
            columns: ["section_id"]
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_transaction_id_fkey"
            columns: ["transaction_id"]
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          event_id: string | null
          id: string
          stripe_payment_intent: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          event_id?: string | null
          id?: string
          stripe_payment_intent: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          event_id?: string | null
          id?: string
          stripe_payment_intent?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          profile_image: string | null
          turnkey_sub_org: string | null
          turnkey_wallet_id: string | null
          updated_at: string | null
          username: string | null
          wallet_address: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          profile_image?: string | null
          turnkey_sub_org?: string | null
          turnkey_wallet_id?: string | null
          updated_at?: string | null
          username?: string | null
          wallet_address?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_image?: string | null
          turnkey_sub_org?: string | null
          turnkey_wallet_id?: string | null
          updated_at?: string | null
          username?: string | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      venues: {
        Row: {
          created_at: string
          created_by: string
          description: string
          id: string
          image: string | null
          name: string
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          id?: string
          image?: string | null
          name: string
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          image?: string | null
          name?: string
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "venues_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venues_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment: {
        Args: {
          table_name: string
          row_id: string
          x: number
          field_name: string
        }
        Returns: undefined
      }
    }
    Enums: {
      chat_type: "group" | "dm"
      group_type: "group" | "dm"
      message_status: "read" | "unread" | "deleted"
      role: "owner" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

