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
          created_at: string | null
          created_by: string
          description: string
          id: string
          image: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description: string
          id?: string
          image?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string
          id?: string
          image?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artists_created_by_fkey"
            columns: ["created_by"]
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
          ga_price: number | null
          ga_tickets: number | null
          id: string
          image: string | null
          ipfs_image: string | null
          location: string
          name: string
          rows: number | null
          seats_per_row: number | null
          tickets_remaining: number | null
          updated_at: string
        }
        Insert: {
          artist: string
          base_url?: string | null
          created_at?: string
          created_by: string
          date: string
          description: string
          etherscan_link?: string | null
          ga_price?: number | null
          ga_tickets?: number | null
          id?: string
          image?: string | null
          ipfs_image?: string | null
          location: string
          name: string
          rows?: number | null
          seats_per_row?: number | null
          tickets_remaining?: number | null
          updated_at?: string
        }
        Update: {
          artist?: string
          base_url?: string | null
          created_at?: string
          created_by?: string
          date?: string
          description?: string
          etherscan_link?: string | null
          ga_price?: number | null
          ga_tickets?: number | null
          id?: string
          image?: string | null
          ipfs_image?: string | null
          location?: string
          name?: string
          rows?: number | null
          seats_per_row?: number | null
          tickets_remaining?: number | null
          updated_at?: string
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
          }
        ]
      }
      tickets: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          price: number
          seat: string
          token_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          price: number
          seat?: string
          token_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          price?: number
          seat?: string
          token_id?: number | null
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
            foreignKeyName: "tickets_user_id_fkey"
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
      [_ in never]: never
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
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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

