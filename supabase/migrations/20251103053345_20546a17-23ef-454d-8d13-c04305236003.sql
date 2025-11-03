-- Create enum for application roles
CREATE TYPE public.app_role AS ENUM (
  'procurement_director',
  'category_manager',
  'compliance_officer',
  'gcc_leader',
  'it_security_officer',
  'legal_team',
  'finance_team'
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user has a role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user has any of multiple roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles app_role[])
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = ANY(_roles)
  )
$$;

-- Create function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS SETOF app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- RLS Policies for user_roles table
-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());

-- Only procurement directors can manage roles
CREATE POLICY "Procurement directors can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'procurement_director'))
WITH CHECK (public.has_role(auth.uid(), 'procurement_director'));

-- Update vendors table RLS to allow role-based access
DROP POLICY IF EXISTS "Users can view their own vendors" ON public.vendors;
CREATE POLICY "Role-based vendor access"
ON public.vendors
FOR SELECT
USING (
  user_id = auth.uid() OR
  public.has_any_role(auth.uid(), ARRAY['procurement_director', 'category_manager', 'compliance_officer', 'gcc_leader', 'it_security_officer', 'legal_team', 'finance_team']::app_role[])
);

DROP POLICY IF EXISTS "Users can insert their own vendors" ON public.vendors;
CREATE POLICY "Managers can create vendors"
ON public.vendors
FOR INSERT
WITH CHECK (
  public.has_any_role(auth.uid(), ARRAY['procurement_director', 'category_manager']::app_role[])
);

DROP POLICY IF EXISTS "Users can update their own vendors" ON public.vendors;
CREATE POLICY "Managers can update vendors"
ON public.vendors
FOR UPDATE
USING (
  public.has_any_role(auth.uid(), ARRAY['procurement_director', 'category_manager']::app_role[])
);

DROP POLICY IF EXISTS "Users can delete their own vendors" ON public.vendors;
CREATE POLICY "Directors can delete vendors"
ON public.vendors
FOR DELETE
USING (
  public.has_role(auth.uid(), 'procurement_director')
);

-- Update assessments table RLS
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.assessments;
CREATE POLICY "Role-based assessment access"
ON public.assessments
FOR SELECT
USING (
  user_id = auth.uid() OR
  public.has_any_role(auth.uid(), ARRAY['procurement_director', 'category_manager', 'compliance_officer', 'gcc_leader', 'it_security_officer']::app_role[])
);

DROP POLICY IF EXISTS "Users can insert their own assessments" ON public.assessments;
CREATE POLICY "Authorized roles can create assessments"
ON public.assessments
FOR INSERT
WITH CHECK (
  public.has_any_role(auth.uid(), ARRAY['procurement_director', 'category_manager', 'compliance_officer', 'it_security_officer']::app_role[])
);

DROP POLICY IF EXISTS "Users can update their own assessments" ON public.assessments;
CREATE POLICY "Authorized roles can update assessments"
ON public.assessments
FOR UPDATE
USING (
  public.has_any_role(auth.uid(), ARRAY['procurement_director', 'category_manager', 'compliance_officer', 'it_security_officer']::app_role[])
);

-- Update documents table RLS
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
CREATE POLICY "Role-based document access"
ON public.documents
FOR SELECT
USING (
  user_id = auth.uid() OR
  public.has_any_role(auth.uid(), ARRAY['procurement_director', 'category_manager', 'compliance_officer', 'legal_team', 'finance_team']::app_role[])
);

DROP POLICY IF EXISTS "Users can insert their own documents" ON public.documents;
CREATE POLICY "Authorized roles can upload documents"
ON public.documents
FOR INSERT
WITH CHECK (
  public.has_any_role(auth.uid(), ARRAY['procurement_director', 'category_manager', 'legal_team']::app_role[])
);

-- Update reports table RLS
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
CREATE POLICY "Role-based report access"
ON public.reports
FOR SELECT
USING (
  user_id = auth.uid() OR
  public.has_any_role(auth.uid(), ARRAY['procurement_director', 'category_manager', 'compliance_officer', 'gcc_leader', 'legal_team', 'finance_team']::app_role[])
);

DROP POLICY IF EXISTS "Users can insert their own reports" ON public.reports;
CREATE POLICY "Authorized roles can create reports"
ON public.reports
FOR INSERT
WITH CHECK (
  public.has_any_role(auth.uid(), ARRAY['procurement_director', 'category_manager', 'compliance_officer', 'gcc_leader']::app_role[])
);

-- Update stakeholders table RLS
DROP POLICY IF EXISTS "Users can view their own stakeholders" ON public.stakeholders;
CREATE POLICY "Role-based stakeholder access"
ON public.stakeholders
FOR SELECT
USING (
  user_id = auth.uid() OR
  public.has_any_role(auth.uid(), ARRAY['procurement_director', 'category_manager', 'compliance_officer']::app_role[])
);

DROP POLICY IF EXISTS "Users can create their own stakeholders" ON public.stakeholders;
CREATE POLICY "Managers can create stakeholders"
ON public.stakeholders
FOR INSERT
WITH CHECK (
  public.has_any_role(auth.uid(), ARRAY['procurement_director', 'category_manager']::app_role[])
);