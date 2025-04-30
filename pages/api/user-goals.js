import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const { user_id, goal_type, goal_value, current_progress } = req.body;

    const { data, error } = await supabase
      .from('user_goals')
      .insert([{ user_id, goal_type, goal_value, current_progress }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true, data });
  }

  if (method === 'GET') {
    const { user_id } = req.query;

    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', user_id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true, data });
  }

  if (method === 'PATCH') {
    const { user_id, goal_type, current_progress } = req.body;

    const { data, error } = await supabase
      .from('user_goals')
      .update({ current_progress })
      .eq('user_id', user_id)
      .eq('goal_type', goal_type);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true, data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
