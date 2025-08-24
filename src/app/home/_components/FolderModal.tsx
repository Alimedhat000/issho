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
  { name: 'Purple', value: '#8B5CF6', class: 'bg-violet-500' },
  { name: 'Pink', value: '#EC4899', class: 'bg-pink-500' },
  { name: 'Orange', value: '#F59E0B', class: 'bg-amber-500' },
  { name: 'Red', value: '#EF4444', class: 'bg-red-500' },
  { name: 'Teal', value: '#14B8A6', class: 'bg-teal-500' },
  { name: 'Indigo', value: '#6366F1', class: 'bg-indigo-500' },
  { name: 'Gray', value: '#6B7280', class: 'bg-gray-500' },
  { name: 'Slate', value: '#64748B', class: 'bg-slate-500' },
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

  // Also reset when initialColor changes (for edit mode)
  useEffect(() => {
    if (initialColor && isOpen) {
      setSelectedColor(initialColor);
    }
  }, [initialColor, isOpen]);

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
      // Force close the modal and clean up
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleClose = () => {
    if (!loading) {
      // Reset form state
      setName('');
      setSelectedColor(FOLDER_COLORS[0].value);
      setError('');

      // Small delay to ensure DOM is ready before closing
      setTimeout(() => {
        onClose();
      }, 50);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !loading) {
          handleClose();
        }
      }}
    >
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
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
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
