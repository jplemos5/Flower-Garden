interface ScoreProps {
    score: number;  // Declare the type of the `score` prop
  }
  
  const Score: React.FC<ScoreProps> = ({ score }) => {
    return (
      score > 0 && (
        <div style={{ width: '100%', alignItems: 'center' }} className="p-4 bg-opacity-0 text-white rounded-lg text-center">
          <p className="text-xl font-bold">Score: {score}</p>
        </div>
      )
    );
  };
  
  export default Score;