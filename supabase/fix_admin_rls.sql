-- Allow admin to view all subscriptions
create policy "Admin can view all subscriptions"
on user_subscriptions for select
using (
  auth.jwt() ->> 'email' = 'academyfrance75@gmail.com'
);

-- Allow admin to insert subscriptions
create policy "Admin can insert subscriptions"
on user_subscriptions for insert
with check (
  auth.jwt() ->> 'email' = 'academyfrance75@gmail.com'
);

-- Allow admin to update subscriptions
create policy "Admin can update subscriptions"
on user_subscriptions for update
using (
  auth.jwt() ->> 'email' = 'academyfrance75@gmail.com'
);

-- Allow admin to delete subscriptions
create policy "Admin can delete subscriptions"
on user_subscriptions for delete
using (
  auth.jwt() ->> 'email' = 'academyfrance75@gmail.com'
);
