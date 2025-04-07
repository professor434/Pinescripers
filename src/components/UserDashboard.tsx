import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import MarketplaceUpload from '@/components/MarketplaceUpload';

export default function UserDashboard() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
        setUser(profile);
      }
    };
    getUser();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">User Dashboard</h2>

      {/* Οι αγορές μου / Downloads */}
      <div>
        <h3 className="text-lg font-semibold">My Purchases</h3>
        {/* Εδώ μπαίνουν τα downloads των approved */}
      </div>

      {/* Τα strategies μου που ανέβηκαν */}
      <div>
        <h3 className="text-lg font-semibold">My Approved Strategies</h3>
        {/* Εδώ μπαίνουν τα approved strategies */}
      </div>

      {/* Ιδέες που έχω στείλει */}
      <div>
        <h3 className="text-lg font-semibold">My Submitted Ideas</h3>
        {/* Εδώ φαίνονται οι ideas που έχει υποβάλει ο user */}
      </div>

      {/* Πρόσβαση στο εργαλείο Strategy Builder */}
      <div>
        <h3 className="text-lg font-semibold">Strategy Builder</h3>
        <Button>Open Builder Tool</Button>
      </div>

      {/* Pro user με wallet μπορεί να δει το κουμπί upload */}
      {user?.role === 'pro' && user?.wallet && (
        <div>
          <h3 className="text-lg font-semibold">Upload Strategy to Marketplace</h3>
          <Button onClick={() => setShowUpload((prev) => !prev)}>
            {showUpload ? 'Hide Upload Form' : 'Upload Strategy'}
          </Button>
          {showUpload && <MarketplaceUpload />}
        </div>
      )}
    </div>
  );
}
