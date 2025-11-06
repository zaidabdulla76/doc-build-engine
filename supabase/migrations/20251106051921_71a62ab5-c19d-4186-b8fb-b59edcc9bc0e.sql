-- Create demo users function using Supabase internal auth functions
-- This will create demo accounts for all personas

-- First, let's create a function to safely create demo users
CREATE OR REPLACE FUNCTION create_demo_user(
  p_email text,
  p_password text,
  p_full_name text,
  p_role app_role
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_encrypted_password text;
BEGIN
  -- Check if user already exists
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = p_email;
  
  IF v_user_id IS NOT NULL THEN
    -- User exists, just ensure role is assigned
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, p_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN v_user_id;
  END IF;
  
  -- Create new user
  v_user_id := gen_random_uuid();
  v_encrypted_password := crypt(p_password, gen_salt('bf'));
  
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    aud,
    role
  ) VALUES (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    p_email,
    v_encrypted_password,
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', p_full_name),
    now(),
    now(),
    '',
    '',
    '',
    '',
    'authenticated',
    'authenticated'
  );
  
  -- Assign role to user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, p_role);
  
  RETURN v_user_id;
END;
$$;

-- Create demo accounts with roles
DO $$
BEGIN
  -- Procurement Director
  PERFORM create_demo_user(
    'procurement@demo.com',
    'demo123',
    'Procurement Director Demo',
    'procurement_director'
  );
  
  -- Category Manager
  PERFORM create_demo_user(
    'category@demo.com',
    'demo123',
    'Category Manager Demo',
    'category_manager'
  );
  
  -- Compliance Officer
  PERFORM create_demo_user(
    'compliance@demo.com',
    'demo123',
    'Compliance Officer Demo',
    'compliance_officer'
  );
  
  -- GCC Leader
  PERFORM create_demo_user(
    'gcc@demo.com',
    'demo123',
    'GCC Leader Demo',
    'gcc_leader'
  );
  
  -- IT Security Officer
  PERFORM create_demo_user(
    'security@demo.com',
    'demo123',
    'IT Security Officer Demo',
    'it_security_officer'
  );
  
  -- Legal Team
  PERFORM create_demo_user(
    'legal@demo.com',
    'demo123',
    'Legal Team Demo',
    'legal_team'
  );
  
  -- Finance Team
  PERFORM create_demo_user(
    'finance@demo.com',
    'demo123',
    'Finance Team Demo',
    'finance_team'
  );
END $$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_demo_user TO postgres, service_role;