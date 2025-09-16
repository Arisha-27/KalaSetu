-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'creator',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Update user_role enum to remove artisan terminology
ALTER TYPE user_role RENAME VALUE 'artisan' TO 'creator';

-- Add RLS policies for existing tables
-- Products policies (change artisan_id to creator_id concept)
CREATE POLICY "Anyone can view published products" 
ON public.products FOR SELECT 
USING (is_published = true);

CREATE POLICY "Creators can view their own products" 
ON public.products FOR SELECT 
USING (artisan_id::text = auth.uid()::text);

CREATE POLICY "Creators can insert their own products" 
ON public.products FOR INSERT 
WITH CHECK (artisan_id::text = auth.uid()::text);

CREATE POLICY "Creators can update their own products" 
ON public.products FOR UPDATE 
USING (artisan_id::text = auth.uid()::text);

CREATE POLICY "Creators can delete their own products" 
ON public.products FOR DELETE 
USING (artisan_id::text = auth.uid()::text);

-- Collections policies
CREATE POLICY "Anyone can view collections" 
ON public.collections FOR SELECT 
USING (true);

CREATE POLICY "Creators can insert their own collections" 
ON public.collections FOR INSERT 
WITH CHECK (artisan_id::text = auth.uid()::text);

CREATE POLICY "Creators can update their own collections" 
ON public.collections FOR UPDATE 
USING (artisan_id::text = auth.uid()::text);

CREATE POLICY "Creators can delete their own collections" 
ON public.collections FOR DELETE 
USING (artisan_id::text = auth.uid()::text);

-- Workshop posts policies
CREATE POLICY "Anyone can view workshop posts" 
ON public.workshop_posts FOR SELECT 
USING (true);

CREATE POLICY "Creators can insert their own posts" 
ON public.workshop_posts FOR INSERT 
WITH CHECK (artisan_id::text = auth.uid()::text);

CREATE POLICY "Creators can update their own posts" 
ON public.workshop_posts FOR UPDATE 
USING (artisan_id::text = auth.uid()::text);

CREATE POLICY "Creators can delete their own posts" 
ON public.workshop_posts FOR DELETE 
USING (artisan_id::text = auth.uid()::text);

-- AI generations log policies
CREATE POLICY "Creators can view their own generations" 
ON public.ai_generations_log FOR SELECT 
USING (artisan_id::text = auth.uid()::text);

CREATE POLICY "Creators can insert their own generations" 
ON public.ai_generations_log FOR INSERT 
WITH CHECK (artisan_id::text = auth.uid()::text);

-- Orders policies
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can insert their own orders" 
ON public.orders FOR INSERT 
WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own orders" 
ON public.orders FOR UPDATE 
USING (user_id::text = auth.uid()::text);

-- Order items policies
CREATE POLICY "Users can view order items for their orders" 
ON public.order_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Users can insert order items for their orders" 
ON public.order_items FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id::text = auth.uid()::text
  )
);

-- Messages and conversations policies
CREATE POLICY "Users can view conversations they participate in" 
ON public.conversations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_participants.conversation_id = conversations.id 
    AND conversation_participants.user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Users can view messages in their conversations" 
ON public.messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_participants.conversation_id = messages.conversation_id 
    AND conversation_participants.user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Users can insert messages in their conversations" 
ON public.messages FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_participants.conversation_id = messages.conversation_id 
    AND conversation_participants.user_id::text = auth.uid()::text
  )
);

-- Conversation participants policies
CREATE POLICY "Users can view conversation participants for their conversations" 
ON public.conversation_participants FOR SELECT 
USING (user_id::text = auth.uid()::text);

-- Followers policies
CREATE POLICY "Anyone can view followers" 
ON public.followers FOR SELECT 
USING (true);

CREATE POLICY "Users can follow others" 
ON public.followers FOR INSERT 
WITH CHECK (follower_id::text = auth.uid()::text);

CREATE POLICY "Users can unfollow others" 
ON public.followers FOR DELETE 
USING (follower_id::text = auth.uid()::text);

-- Product collections policies
CREATE POLICY "Anyone can view product collections" 
ON public.product_collections FOR SELECT 
USING (true);

CREATE POLICY "Creators can manage product collections for their products" 
ON public.product_collections FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM products 
    WHERE products.id = product_collections.product_id 
    AND products.artisan_id::text = auth.uid()::text
  )
);

CREATE POLICY "Creators can update product collections for their products" 
ON public.product_collections FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM products 
    WHERE products.id = product_collections.product_id 
    AND products.artisan_id::text = auth.uid()::text
  )
);

CREATE POLICY "Creators can delete product collections for their products" 
ON public.product_collections FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM products 
    WHERE products.id = product_collections.product_id 
    AND products.artisan_id::text = auth.uid()::text
  )
);

-- Competitor prices - public read access for market data
CREATE POLICY "Anyone can view competitor prices" 
ON public.competitor_prices FOR SELECT 
USING (true);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for profiles timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'full_name'),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'creator')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();