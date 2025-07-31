-- Fix the get_help_analytics function to resolve aggregate nesting issues
CREATE OR REPLACE FUNCTION public.get_help_analytics(start_date timestamp with time zone DEFAULT (now() - '30 days'::interval), end_date timestamp with time zone DEFAULT now())
 RETURNS TABLE(total_questions integer, avg_satisfaction numeric, support_contact_rate numeric, top_questions text[], daily_stats jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  total_count INTEGER;
  avg_satisfaction_val NUMERIC;
  support_rate NUMERIC;
  top_questions_array TEXT[];
  daily_stats_json JSONB;
BEGIN
  -- Get total questions count
  SELECT COUNT(*) INTO total_count
  FROM help_interactions 
  WHERE created_at BETWEEN start_date AND end_date;
  
  -- Get average satisfaction (only non-zero ratings)
  SELECT AVG(feedback_rating::DECIMAL) INTO avg_satisfaction_val
  FROM help_interactions 
  WHERE created_at BETWEEN start_date AND end_date
  AND feedback_rating IS NOT NULL 
  AND feedback_rating != 0;
  
  -- Get support contact rate
  SELECT 
    CASE 
      WHEN COUNT(*) = 0 THEN 0
      ELSE (COUNT(CASE WHEN contacted_support THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL * 100)
    END INTO support_rate
  FROM help_interactions 
  WHERE created_at BETWEEN start_date AND end_date;
  
  -- Get top questions
  SELECT ARRAY(
    SELECT question 
    FROM help_interactions 
    WHERE created_at BETWEEN start_date AND end_date
    AND question IS NOT NULL
    GROUP BY question 
    ORDER BY COUNT(*) DESC 
    LIMIT 10
  ) INTO top_questions_array;
  
  -- Get daily stats
  SELECT jsonb_agg(
    jsonb_build_object(
      'date', day_date,
      'questions', questions_count,
      'satisfaction', satisfaction_avg
    ) ORDER BY day_date
  ) INTO daily_stats_json
  FROM (
    SELECT 
      date_trunc('day', created_at)::date as day_date,
      COUNT(*) as questions_count,
      AVG(CASE WHEN feedback_rating IS NOT NULL AND feedback_rating != 0 THEN feedback_rating::DECIMAL END) as satisfaction_avg
    FROM help_interactions 
    WHERE created_at BETWEEN start_date AND end_date
    GROUP BY date_trunc('day', created_at)
    ORDER BY date_trunc('day', created_at)
  ) daily_grouped;
  
  -- Return the results
  RETURN QUERY
  SELECT 
    total_count,
    avg_satisfaction_val,
    support_rate,
    COALESCE(top_questions_array, ARRAY[]::TEXT[]),
    COALESCE(daily_stats_json, '[]'::jsonb);
END;
$function$;