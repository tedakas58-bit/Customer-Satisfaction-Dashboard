# Supabase Setup Guide

## 🚀 Setting up Supabase for Customer Satisfaction Dashboard

### Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** with your GitHub account
3. **Create New Project**
   - Organization: Choose or create one
   - Name: `customer-satisfaction-dashboard`
   - Database Password: Generate a strong password (save it!)
   - Region: Choose closest to your users
   - Pricing Plan: Start with Free tier

### Step 2: Set up Database Schema

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy and paste** the contents of `supabase-schema.sql`
3. **Run the query** to create tables, indexes, and sample data

### Step 3: Configure Environment Variables

1. **Go to Settings > API** in your Supabase dashboard
2. **Copy your Project URL and Anon Key**
3. **Update your `.env` file**:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Configure Row Level Security (Optional)

The schema includes basic RLS policies. You can customize them:

```sql
-- Example: Restrict survey response access
CREATE POLICY "Users can only read their own responses" ON survey_responses
    FOR SELECT USING (auth.uid() = user_id);

-- Example: Admin-only question management
CREATE POLICY "Only admins can modify questions" ON questions
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### Step 5: Test the Connection

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Check browser console** for any connection errors

3. **Try submitting a survey** to test data insertion

## 📊 Database Schema Overview

### Tables Created:

#### `survey_responses`
- **id**: UUID primary key
- **demographics**: gender, age, marital_status, education_level
- **responses**: JSONB containing all survey answers
- **computed fields**: overall_score, dimension_scores, completion_rate
- **metadata**: created_at, updated_at, ip_address, session_id

#### `questions`
- **id**: UUID primary key
- **question_id**: Unique identifier (e.g., 'q1_facilities')
- **dimension**: Service quality dimension
- **text_amharic**: Question in Amharic
- **text_english**: Question in English
- **order_number**: Display order
- **is_active**: Whether question is currently used

### Indexes for Performance:
- Demographics fields (gender, age, education_level)
- Date fields (created_at)
- Score fields (overall_score)
- Question ordering (order_number)

## 🔄 Real-time Features

The integration includes real-time subscriptions:

```typescript
import { subscriptions } from './services/supabaseService';

// Listen for new survey responses
const unsubscribe = subscriptions.onNewResponse((response) => {
  console.log('New survey submitted:', response);
  // Update your UI in real-time
});

// Clean up subscription
unsubscribe();
```

## 🛡️ Security Considerations

1. **Row Level Security**: Enabled by default
2. **API Keys**: Use anon key for public access, service key for admin functions
3. **Policies**: Customize based on your access requirements
4. **Environment Variables**: Never commit real keys to version control

## 📈 Analytics and Monitoring

Supabase provides built-in analytics:
- **Database Usage**: Monitor storage and bandwidth
- **API Requests**: Track request volume and performance
- **Real-time Connections**: Monitor active subscriptions

## 🔧 Advanced Configuration

### Custom Functions (Optional)

```sql
-- Example: Calculate satisfaction trends
CREATE OR REPLACE FUNCTION get_satisfaction_trends()
RETURNS TABLE (
    date DATE,
    avg_score DECIMAL,
    response_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE(created_at) as date,
        AVG(overall_score) as avg_score,
        COUNT(*) as response_count
    FROM survey_responses
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(created_at)
    ORDER BY date;
END;
$$ LANGUAGE plpgsql;
```

### Backup Strategy

1. **Automatic Backups**: Enabled by default on paid plans
2. **Manual Exports**: Use pg_dump for additional backups
3. **Point-in-time Recovery**: Available on Pro plans

## 🚨 Troubleshooting

### Common Issues:

1. **Connection Errors**:
   - Check environment variables
   - Verify project URL and keys
   - Ensure network connectivity

2. **RLS Policy Errors**:
   - Check policy definitions
   - Verify user permissions
   - Test with different user roles

3. **Performance Issues**:
   - Review query patterns
   - Check index usage
   - Monitor database metrics

### Getting Help:

- **Supabase Docs**: [docs.supabase.com](https://docs.supabase.com)
- **Community**: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)

## 🎯 Next Steps

1. **Test all functionality** with real data
2. **Set up monitoring** and alerts
3. **Configure backups** for production
4. **Implement authentication** if needed
5. **Optimize queries** based on usage patterns

Your Customer Satisfaction Dashboard is now powered by Supabase! 🎉