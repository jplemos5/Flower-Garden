import React, { useState } from 'react';
import { Flower, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AddFlowerFormProps {
  onAdd: (flower: { name: string; imageUrl: string; bloomSeason: string }) => void;
}

export function AddFlowerForm({ onAdd }: AddFlowerFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [bloomSeason, setBloomSeason] = useState('Spring');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/png') {
      setImage(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      alert('Please select a PNG image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !image) return;

    try {
      setUploading(true);
      
      // Upload image to Supabase Storage
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      console.log("Chega aqui")
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('flower-images')
        .upload(fileName, image);

      console.log("File Name:", fileName);
      console.log("Image:", image);
      if (uploadError) console.error("Upload Error:", uploadError);
      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('flower-images')
        .getPublicUrl(fileName);

      // Add flower with image URL
      onAdd({ name, imageUrl: publicUrl, bloomSeason });
      
      // Reset form
      setName('');
      setImage(null);
      setPreviewUrl(null);
      setBloomSeason('Spring');
      setIsOpen(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl p-6 mb-4 w-96">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Flower Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter flower name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Flower Image (PNG only)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <div className="mb-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setPreviewUrl(null);
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                      <span>Upload a PNG</span>
                      <input
                        type="file"
                        accept=".png"
                        className="sr-only"
                        onChange={handleImageChange}
                        required
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bloom Season
              </label>
              <select
                value={bloomSeason}
                onChange={(e) => setBloomSeason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>Spring</option>
                <option>Summer</option>
                <option>Fall</option>
                <option>Winter</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setImage(null);
                  setPreviewUrl(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Add Flower'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        >
          <Flower size={24} />
        </button>
      )}
    </div>
  );
}