export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      collections: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          is_primary?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          collection_id: string
          name: string
          slug: string
          description: string | null
          price: number
          image_url: string | null
          stock: number
          material: string | null
          created_at: string
        }
        Insert: {
          id?: string
          collection_id: string
          name: string
          slug: string
          description?: string | null
          price: number
          image_url?: string | null
          stock?: number
          material?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          collection_id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          image_url?: string | null
          stock?: number
          material?: string | null
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: string
          total: number
          created_at: string
          payment_id: string | null
          order_id: string | null
          customer_name: string | null
          customer_email: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: string
          total: number
          created_at?: string
          payment_id?: string | null
          order_id?: string | null
          customer_name?: string | null
          customer_email?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: string
          total?: number
          created_at?: string
          payment_id?: string | null
          order_id?: string | null
          customer_name?: string | null
          customer_email?: string | null
        }
      }
    }
  }
}