export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      academy_courses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration_hours: number | null
          id: string
          instructor: string | null
          is_featured: boolean | null
          level: string | null
          materials_url: string | null
          order_index: number | null
          price_credits: number | null
          related_tool: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          instructor?: string | null
          is_featured?: boolean | null
          level?: string | null
          materials_url?: string | null
          order_index?: number | null
          price_credits?: number | null
          related_tool?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          instructor?: string | null
          is_featured?: boolean | null
          level?: string | null
          materials_url?: string | null
          order_index?: number | null
          price_credits?: number | null
          related_tool?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          applicant_user_id: string
          applied_at: string
          film_festival_id: string | null
          id: string
          notes: string | null
          project_id: string | null
          status: string
        }
        Insert: {
          applicant_user_id: string
          applied_at?: string
          film_festival_id?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string
        }
        Update: {
          applicant_user_id?: string
          applied_at?: string
          film_festival_id?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_film_festival_id_fkey"
            columns: ["film_festival_id"]
            isOneToOne: false
            referencedRelation: "film_festivals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      audition_notices: {
        Row: {
          additional_credits: string | null
          additional_materials: string | null
          age_range: string | null
          agent_fee_included: boolean | null
          allow_online_demo: boolean | null
          audition_date: string | null
          audition_window: string | null
          callback_dates: string | null
          casting_director: string | null
          character_background: string | null
          compensation_rate: string | null
          compensation_type: string | null
          conflicts: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          director: string | null
          director_cd: string | null
          ethnicity_requirement: string | null
          first_ad: string | null
          gender_preference: string | null
          genre: string | null
          has_intimacy: boolean | null
          has_minors: boolean | null
          has_nudity: boolean | null
          has_violence: boolean | null
          headshot_url: string | null
          id: string
          line_producer: string | null
          location: string
          location_type: string | null
          logline: string | null
          materials_required: string[] | null
          posting_targets: string[] | null
          producer: string | null
          production_company: string | null
          project_name: string
          project_type: string
          rate_of_pay: string
          reel_link: string | null
          resume_url: string | null
          role_description: string
          role_name: string
          safety_details: string | null
          self_tape_deadline: string | null
          shoot_city: string | null
          shoot_country: string | null
          shoot_end_date: string | null
          shoot_start_date: string | null
          slate_link: string | null
          special_instructions: string | null
          status: string
          storyline: string
          submission_deadline: string
          synopsis: string | null
          travel_details: string | null
          travel_lodging: string | null
          union_status: string | null
          updated_at: string
          usage_terms: string | null
          user_id: string
          visibility: string | null
          website: string | null
          work_dates: string | null
          work_location: string | null
          work_type: string
        }
        Insert: {
          additional_credits?: string | null
          additional_materials?: string | null
          age_range?: string | null
          agent_fee_included?: boolean | null
          allow_online_demo?: boolean | null
          audition_date?: string | null
          audition_window?: string | null
          callback_dates?: string | null
          casting_director?: string | null
          character_background?: string | null
          compensation_rate?: string | null
          compensation_type?: string | null
          conflicts?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          director?: string | null
          director_cd?: string | null
          ethnicity_requirement?: string | null
          first_ad?: string | null
          gender_preference?: string | null
          genre?: string | null
          has_intimacy?: boolean | null
          has_minors?: boolean | null
          has_nudity?: boolean | null
          has_violence?: boolean | null
          headshot_url?: string | null
          id?: string
          line_producer?: string | null
          location: string
          location_type?: string | null
          logline?: string | null
          materials_required?: string[] | null
          posting_targets?: string[] | null
          producer?: string | null
          production_company?: string | null
          project_name: string
          project_type: string
          rate_of_pay: string
          reel_link?: string | null
          resume_url?: string | null
          role_description: string
          role_name: string
          safety_details?: string | null
          self_tape_deadline?: string | null
          shoot_city?: string | null
          shoot_country?: string | null
          shoot_end_date?: string | null
          shoot_start_date?: string | null
          slate_link?: string | null
          special_instructions?: string | null
          status?: string
          storyline: string
          submission_deadline: string
          synopsis?: string | null
          travel_details?: string | null
          travel_lodging?: string | null
          union_status?: string | null
          updated_at?: string
          usage_terms?: string | null
          user_id: string
          visibility?: string | null
          website?: string | null
          work_dates?: string | null
          work_location?: string | null
          work_type: string
        }
        Update: {
          additional_credits?: string | null
          additional_materials?: string | null
          age_range?: string | null
          agent_fee_included?: boolean | null
          allow_online_demo?: boolean | null
          audition_date?: string | null
          audition_window?: string | null
          callback_dates?: string | null
          casting_director?: string | null
          character_background?: string | null
          compensation_rate?: string | null
          compensation_type?: string | null
          conflicts?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          director?: string | null
          director_cd?: string | null
          ethnicity_requirement?: string | null
          first_ad?: string | null
          gender_preference?: string | null
          genre?: string | null
          has_intimacy?: boolean | null
          has_minors?: boolean | null
          has_nudity?: boolean | null
          has_violence?: boolean | null
          headshot_url?: string | null
          id?: string
          line_producer?: string | null
          location?: string
          location_type?: string | null
          logline?: string | null
          materials_required?: string[] | null
          posting_targets?: string[] | null
          producer?: string | null
          production_company?: string | null
          project_name?: string
          project_type?: string
          rate_of_pay?: string
          reel_link?: string | null
          resume_url?: string | null
          role_description?: string
          role_name?: string
          safety_details?: string | null
          self_tape_deadline?: string | null
          shoot_city?: string | null
          shoot_country?: string | null
          shoot_end_date?: string | null
          shoot_start_date?: string | null
          slate_link?: string | null
          special_instructions?: string | null
          status?: string
          storyline?: string
          submission_deadline?: string
          synopsis?: string | null
          travel_details?: string | null
          travel_lodging?: string | null
          union_status?: string | null
          updated_at?: string
          usage_terms?: string | null
          user_id?: string
          visibility?: string | null
          website?: string | null
          work_dates?: string | null
          work_location?: string | null
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "audition_notices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      audition_roles: {
        Row: {
          age_range: string | null
          audition_id: string
          created_at: string
          description: string
          gender_presentation: string | null
          id: string
          open_ethnicity: boolean | null
          rate: string | null
          role_name: string
          role_type: string | null
          sides_link: string | null
          skills: string | null
          updated_at: string
          work_dates: string | null
        }
        Insert: {
          age_range?: string | null
          audition_id: string
          created_at?: string
          description: string
          gender_presentation?: string | null
          id?: string
          open_ethnicity?: boolean | null
          rate?: string | null
          role_name: string
          role_type?: string | null
          sides_link?: string | null
          skills?: string | null
          updated_at?: string
          work_dates?: string | null
        }
        Update: {
          age_range?: string | null
          audition_id?: string
          created_at?: string
          description?: string
          gender_presentation?: string | null
          id?: string
          open_ethnicity?: boolean | null
          rate?: string | null
          role_name?: string
          role_type?: string | null
          sides_link?: string | null
          skills?: string | null
          updated_at?: string
          work_dates?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audition_roles_audition_id_fkey"
            columns: ["audition_id"]
            isOneToOne: false
            referencedRelation: "audition_notices"
            referencedColumns: ["id"]
          },
        ]
      }
      call_sheet_background: {
        Row: {
          call_sheet_id: string
          call_time: string | null
          description: string
          id: string
          notes: string | null
          quantity: number | null
        }
        Insert: {
          call_sheet_id: string
          call_time?: string | null
          description: string
          id?: string
          notes?: string | null
          quantity?: number | null
        }
        Update: {
          call_sheet_id?: string
          call_time?: string | null
          description?: string
          id?: string
          notes?: string | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "call_sheet_background_call_sheet_id_fkey"
            columns: ["call_sheet_id"]
            isOneToOne: false
            referencedRelation: "call_sheets"
            referencedColumns: ["id"]
          },
        ]
      }
      call_sheet_cast: {
        Row: {
          actor_name: string
          call_sheet_id: string
          call_time: string | null
          cast_id: string | null
          character_name: string
          id: string
          order_index: number | null
          pickup_time: string | null
          set_ready_time: string | null
          special_instructions: string | null
          status: string | null
        }
        Insert: {
          actor_name: string
          call_sheet_id: string
          call_time?: string | null
          cast_id?: string | null
          character_name: string
          id?: string
          order_index?: number | null
          pickup_time?: string | null
          set_ready_time?: string | null
          special_instructions?: string | null
          status?: string | null
        }
        Update: {
          actor_name?: string
          call_sheet_id?: string
          call_time?: string | null
          cast_id?: string | null
          character_name?: string
          id?: string
          order_index?: number | null
          pickup_time?: string | null
          set_ready_time?: string | null
          special_instructions?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_sheet_cast_call_sheet_id_fkey"
            columns: ["call_sheet_id"]
            isOneToOne: false
            referencedRelation: "call_sheets"
            referencedColumns: ["id"]
          },
        ]
      }
      call_sheet_crew: {
        Row: {
          call_sheet_id: string
          call_time: string | null
          department: string
          id: string
          name: string
          order_index: number | null
          title: string
        }
        Insert: {
          call_sheet_id: string
          call_time?: string | null
          department: string
          id?: string
          name: string
          order_index?: number | null
          title: string
        }
        Update: {
          call_sheet_id?: string
          call_time?: string | null
          department?: string
          id?: string
          name?: string
          order_index?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_sheet_crew_call_sheet_id_fkey"
            columns: ["call_sheet_id"]
            isOneToOne: false
            referencedRelation: "call_sheets"
            referencedColumns: ["id"]
          },
        ]
      }
      call_sheet_scenes: {
        Row: {
          call_sheet_id: string
          cast_ids: string[] | null
          day_night: string | null
          id: string
          location: string | null
          notes: string | null
          order_index: number | null
          pages: string | null
          scene_number: string
          set_description: string
        }
        Insert: {
          call_sheet_id: string
          cast_ids?: string[] | null
          day_night?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          order_index?: number | null
          pages?: string | null
          scene_number: string
          set_description: string
        }
        Update: {
          call_sheet_id?: string
          cast_ids?: string[] | null
          day_night?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          order_index?: number | null
          pages?: string | null
          scene_number?: string
          set_description?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_sheet_scenes_call_sheet_id_fkey"
            columns: ["call_sheet_id"]
            isOneToOne: false
            referencedRelation: "call_sheets"
            referencedColumns: ["id"]
          },
        ]
      }
      call_sheets: {
        Row: {
          associate_director: string | null
          basecamp: string | null
          courtesy_breakfast_time: string | null
          created_at: string
          crew_parking: string | null
          dawn_time: string | null
          day_number: string | null
          director: string | null
          executive_producers: string[] | null
          general_crew_call: string | null
          high_temp: string | null
          hospital_address: string | null
          id: string
          line_producer: string | null
          location_address: string | null
          low_temp: string | null
          lunch_time: string | null
          nearest_hospital: string | null
          producers: string[] | null
          production_company: string
          production_office_address: string | null
          project_name: string
          schedule_color: string | null
          script_color: string | null
          shoot_date: string
          shooting_call: string | null
          shooting_location: string | null
          sunrise_time: string | null
          sunset_time: string | null
          twilight_time: string | null
          updated_at: string
          upm: string | null
          user_id: string
          weather_description: string | null
          wrap_time: string | null
        }
        Insert: {
          associate_director?: string | null
          basecamp?: string | null
          courtesy_breakfast_time?: string | null
          created_at?: string
          crew_parking?: string | null
          dawn_time?: string | null
          day_number?: string | null
          director?: string | null
          executive_producers?: string[] | null
          general_crew_call?: string | null
          high_temp?: string | null
          hospital_address?: string | null
          id?: string
          line_producer?: string | null
          location_address?: string | null
          low_temp?: string | null
          lunch_time?: string | null
          nearest_hospital?: string | null
          producers?: string[] | null
          production_company: string
          production_office_address?: string | null
          project_name: string
          schedule_color?: string | null
          script_color?: string | null
          shoot_date: string
          shooting_call?: string | null
          shooting_location?: string | null
          sunrise_time?: string | null
          sunset_time?: string | null
          twilight_time?: string | null
          updated_at?: string
          upm?: string | null
          user_id: string
          weather_description?: string | null
          wrap_time?: string | null
        }
        Update: {
          associate_director?: string | null
          basecamp?: string | null
          courtesy_breakfast_time?: string | null
          created_at?: string
          crew_parking?: string | null
          dawn_time?: string | null
          day_number?: string | null
          director?: string | null
          executive_producers?: string[] | null
          general_crew_call?: string | null
          high_temp?: string | null
          hospital_address?: string | null
          id?: string
          line_producer?: string | null
          location_address?: string | null
          low_temp?: string | null
          lunch_time?: string | null
          nearest_hospital?: string | null
          producers?: string[] | null
          production_company?: string
          production_office_address?: string | null
          project_name?: string
          schedule_color?: string | null
          script_color?: string | null
          shoot_date?: string
          shooting_call?: string | null
          shooting_location?: string | null
          sunrise_time?: string | null
          sunset_time?: string | null
          twilight_time?: string | null
          updated_at?: string
          upm?: string | null
          user_id?: string
          weather_description?: string | null
          wrap_time?: string | null
        }
        Relationships: []
      }
      course_discussions: {
        Row: {
          content: string
          course_id: string
          created_at: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          title: string
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          content: string
          course_id: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          content?: string
          course_id?: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "course_discussions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_discussions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      course_quizzes: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          is_required_for_certification: boolean | null
          max_attempts: number | null
          order_index: number | null
          passing_score: number
          time_limit_minutes: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_required_for_certification?: boolean | null
          max_attempts?: number | null
          order_index?: number | null
          passing_score?: number
          time_limit_minutes?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_required_for_certification?: boolean | null
          max_attempts?: number | null
          order_index?: number | null
          passing_score?: number
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          stripe_payment_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          stripe_payment_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          stripe_payment_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string
          id: string
          is_solution: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id: string
          id?: string
          is_solution?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string
          id?: string
          is_solution?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "course_discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      film_festivals: {
        Row: {
          acceptance_rate: number | null
          awards: string[] | null
          categories: string[] | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string
          early_deadline: string | null
          end_date: string | null
          entry_fees_range: string | null
          featured: boolean
          festival_tier: string | null
          filmfreeway_url: string | null
          genres: string[] | null
          id: string
          late_deadline: string | null
          location: string
          name: string
          notification_date: string | null
          requirements: string | null
          start_date: string
          status: string
          submission_deadline: string | null
          submission_fee: string | null
          submission_url: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          acceptance_rate?: number | null
          awards?: string[] | null
          categories?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description: string
          early_deadline?: string | null
          end_date?: string | null
          entry_fees_range?: string | null
          featured?: boolean
          festival_tier?: string | null
          filmfreeway_url?: string | null
          genres?: string[] | null
          id?: string
          late_deadline?: string | null
          location: string
          name: string
          notification_date?: string | null
          requirements?: string | null
          start_date: string
          status?: string
          submission_deadline?: string | null
          submission_fee?: string | null
          submission_url?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          acceptance_rate?: number | null
          awards?: string[] | null
          categories?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string
          early_deadline?: string | null
          end_date?: string | null
          entry_fees_range?: string | null
          featured?: boolean
          festival_tier?: string | null
          filmfreeway_url?: string | null
          genres?: string[] | null
          id?: string
          late_deadline?: string | null
          location?: string
          name?: string
          notification_date?: string | null
          requirements?: string | null
          start_date?: string
          status?: string
          submission_deadline?: string | null
          submission_fee?: string | null
          submission_url?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          company_name: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          location: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          age_range: string | null
          audition_date: string | null
          casting_director: string | null
          compensation: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          deadline_date: string | null
          description: string
          featured: boolean
          gender_preference: string | null
          id: string
          location: string | null
          production_company: string | null
          project_name: string
          project_type: string
          requirements: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age_range?: string | null
          audition_date?: string | null
          casting_director?: string | null
          compensation?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          deadline_date?: string | null
          description: string
          featured?: boolean
          gender_preference?: string | null
          id?: string
          location?: string | null
          production_company?: string | null
          project_name?: string
          project_type?: string
          requirements?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age_range?: string | null
          audition_date?: string | null
          casting_director?: string | null
          compensation?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          deadline_date?: string | null
          description?: string
          featured?: boolean
          gender_preference?: string | null
          id?: string
          location?: string | null
          production_company?: string | null
          project_name?: string
          project_type?: string
          requirements?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          explanation: string | null
          id: string
          options: Json
          order_index: number | null
          points: number | null
          question_text: string
          question_type: string
          quiz_id: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          options: Json
          order_index?: number | null
          points?: number | null
          question_text: string
          question_type?: string
          quiz_id: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          options?: Json
          order_index?: number | null
          points?: number | null
          question_text?: string
          question_type?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "course_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      script_analyses: {
        Row: {
          analysis_result: Json | null
          character_count: number | null
          confidence_score: number | null
          created_at: string
          genre: string | null
          id: string
          is_validated: boolean | null
          script_text: string
          selected_directors: string[] | null
          tone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          analysis_result?: Json | null
          character_count?: number | null
          confidence_score?: number | null
          created_at?: string
          genre?: string | null
          id?: string
          is_validated?: boolean | null
          script_text: string
          selected_directors?: string[] | null
          tone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          analysis_result?: Json | null
          character_count?: number | null
          confidence_score?: number | null
          created_at?: string
          genre?: string | null
          id?: string
          is_validated?: boolean | null
          script_text?: string
          selected_directors?: string[] | null
          tone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      storyboard_projects: {
        Row: {
          character_count: number | null
          character_definitions: Json | null
          created_at: string
          genre: string | null
          id: string
          is_complete: boolean | null
          script_text: string
          shots: Json | null
          storyboard_frames: Json | null
          style_reference_prompt: string | null
          tone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          character_count?: number | null
          character_definitions?: Json | null
          created_at?: string
          genre?: string | null
          id?: string
          is_complete?: boolean | null
          script_text: string
          shots?: Json | null
          storyboard_frames?: Json | null
          style_reference_prompt?: string | null
          tone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          character_count?: number | null
          character_definitions?: Json | null
          created_at?: string
          genre?: string | null
          id?: string
          is_complete?: boolean | null
          script_text?: string
          shots?: Json | null
          storyboard_frames?: Json | null
          style_reference_prompt?: string | null
          tone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_certifications: {
        Row: {
          certificate_number: string | null
          certificate_url: string | null
          course_id: string | null
          created_at: string | null
          id: string
          issued_at: string | null
          skills_earned: string[] | null
          user_id: string
        }
        Insert: {
          certificate_number?: string | null
          certificate_url?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          issued_at?: string | null
          skills_earned?: string[] | null
          user_id: string
        }
        Update: {
          certificate_number?: string | null
          certificate_url?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          issued_at?: string | null
          skills_earned?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_certifications_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_course_progress: {
        Row: {
          completed_at: string | null
          course_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          notes: string | null
          progress_percentage: number | null
          started_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          notes?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          notes?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "academy_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          available_credits: number | null
          created_at: string | null
          id: string
          total_credits: number | null
          updated_at: string | null
          used_credits: number | null
          user_id: string
        }
        Insert: {
          available_credits?: number | null
          created_at?: string | null
          id?: string
          total_credits?: number | null
          updated_at?: string | null
          used_credits?: number | null
          user_id: string
        }
        Update: {
          available_credits?: number | null
          created_at?: string | null
          id?: string
          total_credits?: number | null
          updated_at?: string | null
          used_credits?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_quiz_attempts: {
        Row: {
          answers: Json
          attempt_number: number
          completed_at: string | null
          created_at: string | null
          id: string
          passed: boolean
          quiz_id: string
          score: number
          time_taken_seconds: number | null
          total_questions: number
          user_id: string
        }
        Insert: {
          answers: Json
          attempt_number?: number
          completed_at?: string | null
          created_at?: string | null
          id?: string
          passed: boolean
          quiz_id: string
          score: number
          time_taken_seconds?: number | null
          total_questions: number
          user_id: string
        }
        Update: {
          answers?: Json
          attempt_number?: number
          completed_at?: string | null
          created_at?: string | null
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          time_taken_seconds?: number | null
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "course_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_discussion_views: {
        Args: { discussion_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      user_role: "filmmaker" | "film_festival" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      user_role: ["filmmaker", "film_festival", "admin"],
    },
  },
} as const
