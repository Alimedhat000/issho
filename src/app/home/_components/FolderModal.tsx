'use client';

import React, { useEffect, useState } from 'react';
import { Check, Folder } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, color: string) => Promise<void>;
  initialName?: string;
  initialColor?: string;
  mode: 'create' | 'edit';
  loading?: boolean;
}

const FOLDER_COLORS = [
  { name: 'Blue', value: '#3B82F6', class: 'bg-blue-500' },
  { name: 'Green', value: '#10B981', class: 'bg-emerald-500' },
  { name: 'Red', value: '#EF4444', class: 'bg-red-500' },
  { name: 'Purple', value: '#8B5CF6', class: 'bg-violet-500' },
  { name: 'Pink', value: '#EC4899', class: 'bg-pink-500' },
  { name: 'Slate', value: '#334155', class: 'bg-slate-700' },
  { name: 'Rose', value: '#f32257', class: 'bg-rose-500' },
  { name: 'Lime', value: '#7ccf00', class: 'bg-lime-500' },
  { name: 'Amber', value: '#F59E0B', class: 'bg-amber-500' },
  { name: 'Gray', value: '#6B7280', class: 'bg-gray-500' },
];

export function FolderModal({
  isOpen,
  onClose,
  onSubmit,
  initialName = '',
  initialColor = FOLDER_COLORS[0].value,
  mode,
  loading = false,
}: FolderModalProps) {
  const [name, setName] = useState(initialName);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [error, setError] = useState('');

  // Reset form when modal opens/closes or when initial values change
  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setSelectedColor(initialColor || FOLDER_COLORS[0].value);
      setError('');
    }
  }, [isOpen, initialName, initialColor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Folder name is required');
      return;
    }

    if (name.trim().length > 50) {
      setError('Folder name must be less than 50 characters');
      return;
    }

    try {
      setError('');
      await onSubmit(name.trim(), selectedColor);
      // Don't call onClose here - let the parent handle it after successful submission
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  // Simplified close handler - just call the parent's onClose
  const handleOpenChange = (open: boolean) => {
    if (!open && !loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            {mode === 'create' ? 'Create New Folder' : 'Edit Folder'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name..."
              disabled={loading}
              maxLength={50}
              autoFocus
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <div className="space-y-3">
            <Label>Color</Label>
            <div className="grid grid-cols-5 gap-3">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  disabled={loading}
                  className={`relative h-10 w-10 rounded-lg transition-all hover:scale-110 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${color.class} `}
                  title={color.name}
                >
                  {selectedColor === color.value && (
                    <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : mode === 'create' ? (
                'Create Folder'
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
