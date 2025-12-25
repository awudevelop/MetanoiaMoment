-- Metanoia Moment Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type testimony_status as enum ('pending', 'approved', 'rejected');

-- Create profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text,
  avatar_url text,
  bio text,
  is_admin boolean default false not null
);

-- Create testimonies table
create table public.testimonies (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.profiles on delete cascade not null,
  title text not null,
  description text,
  video_url text not null,
  thumbnail_url text,
  duration integer, -- in seconds
  language text default 'en' not null,
  tags text[] default '{}',
  status testimony_status default 'pending' not null,
  view_count integer default 0 not null,
  featured boolean default false not null,
  published_at timestamp with time zone
);

-- Create indexes for performance
create index testimonies_user_id_idx on public.testimonies(user_id);
create index testimonies_status_idx on public.testimonies(status);
create index testimonies_language_idx on public.testimonies(language);
create index testimonies_featured_idx on public.testimonies(featured) where featured = true;
create index testimonies_published_at_idx on public.testimonies(published_at desc nulls last);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.testimonies enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Testimonies policies
create policy "Approved testimonies are viewable by everyone"
  on public.testimonies for select
  using (status = 'approved' or auth.uid() = user_id);

create policy "Authenticated users can insert testimonies"
  on public.testimonies for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own testimonies"
  on public.testimonies for update
  using (auth.uid() = user_id or exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

create policy "Admins can delete testimonies"
  on public.testimonies for delete
  using (exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_testimonies_updated_at
  before update on public.testimonies
  for each row execute procedure public.handle_updated_at();

-- Create storage bucket for testimonies
insert into storage.buckets (id, name, public)
values ('testimonies', 'testimonies', true)
on conflict (id) do nothing;

-- Storage policies for testimonies bucket
create policy "Anyone can view testimony videos"
  on storage.objects for select
  using (bucket_id = 'testimonies');

create policy "Authenticated users can upload testimony videos"
  on storage.objects for insert
  with check (
    bucket_id = 'testimonies'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own testimony videos"
  on storage.objects for update
  using (
    bucket_id = 'testimonies'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own testimony videos"
  on storage.objects for delete
  using (
    bucket_id = 'testimonies'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
