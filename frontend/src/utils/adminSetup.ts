import { supabase } from '../lib/supabase';

/**
 * Utility to create the first admin user
 * This should be run once to set up the initial admin account
 */
export const createAdminUser = async (email: string, password: string) => {
  try {
    // Sign up the admin user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'admin',
          full_name: 'System Administrator'
        }
      }
    });

    if (error) {
      throw error;
    }

    console.log('Admin user created successfully:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if user has admin privileges
 */
export const isAdmin = (user: any) => {
  return user?.user_metadata?.role === 'admin' || user?.email?.includes('admin');
};

/**
 * Test Supabase connection
 */
export const testSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('questions').select('count').limit(1);
    
    if (error) {
      throw error;
    }

    return { success: true, message: 'Supabase connection successful' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};