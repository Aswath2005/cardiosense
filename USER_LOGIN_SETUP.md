# CardioSense - User Login Tracking Setup

## What Was Added

Your app now automatically records:
- ✅ User signups (email/password)
- ✅ User logins (email/password)
- ✅ OAuth logins (Google/GitHub)
- ✅ Login timestamp
- ✅ Email address
- ✅ Authentication method
- ✅ IP address and user agent

---

## Step 1: Create User Login History Table in Supabase

1. **Go to Supabase Dashboard** → **SQL Editor** → **New query**
2. **Copy and paste this SQL:**

```sql
CREATE TABLE IF NOT EXISTS user_logins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  email text NOT NULL,
  login_time timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  auth_method text CHECK (auth_method IN ('email', 'google', 'github', 'mock')),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE user_logins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert logins"
  ON user_logins FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own logins"
  ON user_logins FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX idx_user_logins_user_id ON user_logins(user_id);
CREATE INDEX idx_user_logins_login_time ON user_logins(login_time DESC);
```

3. **Click "Run"** ✅

---

## Step 2: View User Logins

After users sign up or log in, check the recorded data:

1. Go to **Supabase Dashboard** → **Table Editor**
2. Select **user_logins** table
3. You'll see columns:
   - `id` - Unique login record ID
   - `user_id` - User's ID from auth table
   - `email` - User's email address
   - `login_time` - When they logged in (auto-recorded)
   - `ip_address` - Their IP address
   - `user_agent` - Their browser/device info
   - `auth_method` - How they logged in (email, google, github, mock)

### Example:
```
| user_id                              | email              | login_time          | auth_method |
|--------------------------------------|--------------------|---------------------|-------------|
| 550e8400-e29b-41d4-a716-446655440000 | john@example.com   | 2026-04-26 10:30:00 | email       |
| 550e8400-e29b-41d4-a716-446655440001 | jane@example.com   | 2026-04-26 11:15:00 | google      |
| 550e8400-e29b-41d4-a716-446655440002 | bob@example.com    | 2026-04-26 09:45:00 | github      |
```

---

## Step 3: Automatic Recording

The system now automatically records logins when:

### Signup (Email/Password)
```
User fills signup form
  ↓ Signs up with Supabase
  ↓ User profile stored in "users" table
  ↓ Login recorded in "user_logins" table ✅
  ↓ Redirects to home
```

### Login (Email/Password)
```
User enters email/password
  ↓ Logs in with Supabase
  ↓ Login recorded in "user_logins" table ✅
  ↓ Redirects to dashboard
```

### OAuth Login (Google/GitHub)
```
User clicks "Sign in with Google/GitHub"
  ↓ OAuth callback redirects back
  ↓ Session established
  ↓ Login recorded in "user_logins" table ✅
  ↓ Redirects to dashboard
```

---

## Step 4: Query Login History (Optional)

You can query login history in SQL:

### All logins for a user:
```sql
SELECT * FROM user_logins 
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY login_time DESC;
```

### Recent logins (last 24 hours):
```sql
SELECT email, auth_method, login_time 
FROM user_logins 
WHERE login_time > NOW() - INTERVAL '24 hours'
ORDER BY login_time DESC;
```

### Login count per user:
```sql
SELECT user_id, email, COUNT(*) as login_count
FROM user_logins
GROUP BY user_id, email
ORDER BY login_count DESC;
```

---

## Files Updated

1. ✅ `/app/api/auth/login-record/route.ts` - API endpoint to record logins
2. ✅ `/app/signup/page.tsx` - Records login on signup
3. ✅ `/app/login/page.tsx` - Records login on email/password signin
4. ✅ `/app/auth/callback/page.tsx` - Records login on OAuth signin

---

## Testing

1. **Restart dev server:** `npm run dev`
2. **Sign up** a new account at `/signup`
3. **Check Supabase:** Table Editor → `user_logins` table
4. You should see a new record with your login!

---

## Troubleshooting

### Logins not showing up?
- Make sure `user_logins` table was created with SQL above
- Check Supabase dashboard for errors in SQL Editor
- Check browser console (F12) for error messages

### Data appears but `user_id` is NULL?
- This might happen with mock auth in development
- For real users, it will have their actual user ID

### IP address showing as "unknown"?
- Some environments don't expose IP addresses
- This is normal and expected in some deployment scenarios

