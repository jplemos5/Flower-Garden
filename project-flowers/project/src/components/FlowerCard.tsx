import { X } from 'lucide-react';

interface FlowerCardProps {
  id: number;
  name: string;
  imageUrl: string;
  bloomSeason: string;
  isOwner: boolean;
  dateCreated: string;
  onRemove: () => void;
}



export function FlowerCard({ name, imageUrl, bloomSeason, isOwner, dateCreated, onRemove }: FlowerCardProps) {
  console.log(name)
  return (
    <div className="relative group flower-animation">
      <div className="w-24 h-24 relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain transition-transform hover:scale-110 cursor-pointer"
        />
        
        {isOwner && (
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
          >
            <X size={16} />
          </button>
        )}

        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-75 text-white text-xs rounded-md px-3 py-2 whitespace-nowrap z-10">
          <p className="font-semibold mb-1">{name}</p>
          <p className="text-gray-200">Blooms in {bloomSeason}</p>
          <p className="text-gray-200">{new Date(dateCreated).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}