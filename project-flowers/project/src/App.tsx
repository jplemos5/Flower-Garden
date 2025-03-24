import { useEffect, useState } from 'react';
import { FlowerCard } from './components/FlowerCard';
import { AddFlowerForm } from './components/AddFlowerForm';
import Cat  from './components/Cat';
import { supabase, type Flower } from './lib/supabase';
import Score from './components/Score';

function App() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [score, setScore] = useState<number>(0);

  const increaseScore = (points: number) => {
    setScore((prevScore) => prevScore + points);
  };

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchFlowers();

    const channel = supabase
      .channel('public:flowers')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'flowers' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setFlowers((current) => [...current, payload.new as Flower]);
          } else if (payload.eventType === 'DELETE') {
            setFlowers((current) =>
              current.filter((flower) => flower.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchFlowers() {
    try {
      const { data, error } = await supabase
        .from('flowers')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      setFlowers(data || []);
    } catch (error) {
      console.error('Error fetching flowers:', error);
    } finally {
      setLoading(false);
    }
  }

  const addFlower = async (flower: { name: string; imageUrl: string; bloomSeason: string }) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.from('flowers').insert([{
        ...flower,
        created_by: user.id
      }]);
      if (error) throw error;
    } catch (error) {
      console.error('Error adding flower:', error);
    }
  };

  const removeFlower = async (id: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('flowers')
        .delete()
        .eq('id', id)
        .eq('created_by', user.id);
      if (error) throw error;
    } catch (error) {
      console.error('Error removing flower:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Mountain Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/Flower-Garden/assets/grass2.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100%'
        }}
      />
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-black bg-opacity-50 p-6 text-center flex justify-center items-center relative">
      {/* Centered Content */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">O Nosso Jardim</h1>
          <p className="text-gray-200">
            {user ? 'Start adding your beautiful flowers!' : 'Aproveita a vista do nosso jardim.'}
          </p>
        </div>
      {/* Score Bar Positioned in the Top Right */}
        <div className="absolute top-6 right-6">
          <Score score={score} />
        </div>
      </div>

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-4">
              <p className="text-lg">Loading garden...</p>
            </div>
          </div>
        )}

        {/* Spacer to push garden to bottom */}
        <div className="flex-grow" />
        <Cat img="/Flower-Garden/assets/pusheen-love.gif" direction="right-to-left" time_to_repeat={15000} animation_duration="8s" scoreOnClick={100} increaseScore={increaseScore}/>
        <Cat img="/Flower-Garden/assets/giphy.gif" direction="left-to-right" time_to_repeat={13000} animation_duration="15s" scoreOnClick={100} increaseScore={increaseScore}/>
        <Cat 
          img={[
            "/Flower-Garden/assets/first_cat.png",
            "/Flower-Garden/assets/second_cat.png",
            "/Flower-Garden/assets/third_cat.png",
            "/Flower-Garden/assets/fourth_cat.png",
          ]}
          direction="left-to-right"
          time_to_repeat={8000}
          animation_duration="3s"
          scoreOnClick={200}
          increaseScore={increaseScore}
        />
        <img src="/Flower-Garden/assets/cats-cat.gif" alt="" style={{width:'10%', bottom: '0px', position: 'absolute', zIndex: 10000}} />
        {/* Garden Plot */}
        <div className="w-full max-w-6xl mx-auto mb-10 px-3">
          <div className="bg-black bg-opacity-0  rounded-lg p-8 border-brown-700 border-opacity-40">
            <div className="flex flex-wrap justify-center items-end gap-6 min-h-[275px]">
              {flowers.map((flower) => (
                <FlowerCard
                  key={flower.id}
                  {...flower}
                  isOwner={user?.id === flower.created_by}
                  dateCreated={flower.created_at}
                  onRemove={() => removeFlower(flower.id)}
                />
              ))}
              {!loading && flowers.length === 0 && (
                <div className="text-white text-center p-8">
                  {user ? 'The garden is empty. Plant the first flower!' : 'Sign in to start planting flowers'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Flower Form - Only visible to authenticated user */}
        {user && <AddFlowerForm onAdd={addFlower} />}
      </div>
    </div>
  );
}

export default App;