
-- Insert admin role for the specific user
INSERT INTO public.user_roles (user_id, role)
VALUES ('78b93cf6-d81c-45de-9154-e56d50d1754e', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
