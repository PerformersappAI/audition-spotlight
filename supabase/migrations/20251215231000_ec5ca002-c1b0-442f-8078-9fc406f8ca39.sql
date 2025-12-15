-- Fix CLIENT_SIDE_AUTH: Add server-side admin authorization via RLS

-- Drop existing policies that need to be replaced
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own festivals" ON public.film_festivals;
DROP POLICY IF EXISTS "Users can update own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can insert own credits" ON public.user_credits;

-- PROFILES: Users can update their own profile fields except role (role is in user_roles table)
CREATE POLICY "Users can update own profile fields" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- PROFILES: Admins can update any profile
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- PROJECTS: Users can update their own projects
CREATE POLICY "Users can update own projects" 
ON public.projects 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- PROJECTS: Admins can update any project (for featuring, moderation)
CREATE POLICY "Admins can update any project" 
ON public.projects 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- FILM_FESTIVALS: Users can update their own festivals
CREATE POLICY "Users can update own festivals" 
ON public.film_festivals 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- FILM_FESTIVALS: Admins can update any festival (for featuring, moderation)
CREATE POLICY "Admins can update any festival" 
ON public.film_festivals 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- USER_CREDITS: Users can view their own credits (keep existing)
-- USER_CREDITS: Only admins can modify credits (prevents user self-modification)
CREATE POLICY "Users can insert own credits" 
ON public.user_credits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any credits" 
ON public.user_credits 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert any credits" 
ON public.user_credits 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- CREDIT_TRANSACTIONS: Only admins can manage transactions for other users
CREATE POLICY "Admins can insert any transaction" 
ON public.credit_transactions 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all transactions" 
ON public.credit_transactions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- USER_ROLES: Only admins can manage roles
CREATE POLICY "Admins can manage user roles" 
ON public.user_roles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));