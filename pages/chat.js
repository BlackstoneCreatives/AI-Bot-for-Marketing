import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Chat() {
  const [loading, setLoading] = useState(true);
  const [userActive, setUserActive] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login'; // or show login component
        return;
      }

      const { data, error } = await supabase
        .from('profiles') // or whatever your table is named
        .select('subscription_status')
        .eq('id', user.id)
        .single();

      if (error || !data || data.subscription_status !== 'active') {
        setUserActive(false);
      } else {
        setUserActive(true);
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <p style={{ color: '#fff' }}>Loading...</p>;
  if (!userActive)
    return (
      <div style={{ padding: '20px', color: '#fff', textAlign: 'center' }}>
        <h3>Access Denied</h3>
        <p>Your subscription is inactive or canceled.</p>
      </div>
    );
