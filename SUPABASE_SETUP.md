# Supabase Setup for Visitor Tracking

This document explains how to set up Supabase for tracking website visitor data.

## 1. Database Setup

### Apply the Migration
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Navigate to your project: `xyfccngjyuoqsjhxrllg`
3. Go to the SQL Editor
4. Copy and paste the contents of `supabase-migrations/001_create_visitor_tracking_tables.sql`
5. Run the migration

### What the Migration Creates:
- **quiz_sessions**: Track user sessions and quiz progress
- **quiz_answers**: Store individual quiz answers
- **page_views**: Track page navigation
- **user_interactions**: Track clicks, form submissions, etc.
- **payment_attempts**: Track payment flow
- **loading_screen_events**: Track loading screen interactions
- **device_info**: Store device and browser information
- **conversion_funnel**: Track conversion funnel steps

## 2. Environment Configuration

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xyfccngjyuoqsjhxrllg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Get Your API Keys:
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "anon public" key
4. Paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Install Dependencies

```bash
npm install @supabase/supabase-js
```

## 4. Integration Points

The tracking service is already integrated into your components. Here's how to use it:

### Quiz Page Tracking
```typescript
import { trackQuizAnswer, trackInteraction, trackFunnelStep } from '@/lib/supabase-tracking'

// Track quiz answers
trackQuizAnswer({
  step_number: 1,
  question_type: 'name',
  answer_data: { name: 'John' }
})

// Track interactions
trackInteraction({
  interaction_type: 'button_press',
  element_id: 'next-button',
  element_text: 'Next'
})

// Track funnel steps
trackFunnelStep({
  funnel_step: 'quiz_start',
  step_order: 1,
  is_completed: true
})
```

### Payment Tracking
```typescript
import { trackPaymentAttempt } from '@/lib/supabase-tracking'

// Track payment attempts
trackPaymentAttempt({
  payment_method: 'card',
  amount: 17.9,
  status: 'attempted',
  payment_data: { card_type: 'visa' }
})
```

### Loading Screen Tracking
```typescript
import { trackLoadingEvent } from '@/lib/supabase-tracking'

// Track loading events
trackLoadingEvent({
  event_type: 'started',
  progress_percentage: 0
})
```

## 5. Data Analytics

### Key Metrics You Can Track:
- **Conversion Rate**: Quiz start → Quiz completion → Payment
- **Drop-off Points**: Where users leave the funnel
- **Device Performance**: Mobile vs Desktop conversion rates
- **Payment Success Rate**: Failed vs successful payments
- **Time to Complete**: How long users spend on each step
- **Geographic Data**: Where your users are located

### Sample Queries:

```sql
-- Get conversion funnel data
SELECT 
  funnel_step,
  COUNT(*) as count,
  COUNT(*) * 100.0 / (SELECT COUNT(*) FROM conversion_funnel WHERE funnel_step = 'quiz_start') as conversion_rate
FROM conversion_funnel 
GROUP BY funnel_step 
ORDER BY step_order;

-- Get payment success rate
SELECT 
  status,
  COUNT(*) as count,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage
FROM payment_attempts 
GROUP BY status;

-- Get device performance
SELECT 
  device_type,
  COUNT(*) as sessions,
  COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_sessions
FROM quiz_sessions qs
JOIN device_info di ON qs.session_id = di.session_id
GROUP BY device_type;
```

## 6. Privacy Considerations

- All tracking is anonymous (no personal data stored)
- Session IDs are generated client-side
- No sensitive payment data is stored
- Row Level Security (RLS) is enabled
- Data retention policies can be configured

## 7. Troubleshooting

### Common Issues:
1. **"Unauthorized" errors**: Check your API key
2. **"Table doesn't exist"**: Run the migration first
3. **"RLS policy violation"**: Check the policies in the migration

### Debug Mode:
Add this to your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

This will log all tracking events to the console for debugging.

## 8. Next Steps

1. Apply the migration to your Supabase project
2. Set up your environment variables
3. Test the tracking by going through the quiz flow
4. Check your Supabase dashboard to see the data
5. Set up dashboards and alerts as needed
