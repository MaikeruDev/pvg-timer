import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { TournamentSettings, BlindLevel } from '../types';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TournamentSettings;
  onSave: (settings: Partial<TournamentSettings>) => void;
  levels: BlindLevel[];
  onSaveLevels: (levels: BlindLevel[]) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSave, levels, onSaveLevels }: SettingsModalProps) {
  const [tab, setTab] = useState<'general' | 'payouts' | 'blinds'>('general');
  const [formData, setFormData] = useState<TournamentSettings>(settings);
  const [localPayouts, setLocalPayouts] = useState<number[]>(settings.payoutSplit);
  const [localLevels, setLocalLevels] = useState<BlindLevel[]>(levels);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(settings);
      setLocalPayouts(settings.payoutSplit);
      setLocalLevels(levels);
      setTab('general');
      setDraggedIndex(null);
    }
  }, [isOpen, settings, levels]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }));
  };

  const handlePlacesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = Math.max(1, parseInt(e.target.value) || 1);
    const newPayouts = [...localPayouts];
    if (n > newPayouts.length) {
      while (newPayouts.length < n) newPayouts.push(0);
    } else {
      newPayouts.length = n;
    }
    setLocalPayouts(newPayouts);
  };

  const handlePayoutChange = (index: number, value: string) => {
    const newPayouts = [...localPayouts];
    newPayouts[index] = Number(value);
    setLocalPayouts(newPayouts);
  };

  const recalculateLevels = (levelsToRecalc: BlindLevel[]) => {
    let currentLevel = 1;
    return levelsToRecalc.map(level => {
      if (level.isBreak) {
        return { ...level, level: 0 };
      } else {
        return { ...level, level: currentLevel++ };
      }
    });
  };

  const handleLevelChange = (index: number, field: keyof BlindLevel, value: any) => {
    const newLevels = [...localLevels];
    newLevels[index] = { ...newLevels[index], [field]: value };
    setLocalLevels(newLevels);
  };

  const addLevel = () => {
    const lastLevel = [...localLevels].reverse().find(l => !l.isBreak);
    const newLevels = [...localLevels, {
      level: 0,
      blinds: (lastLevel?.blinds || 0) * 2 || 25,
      bigBlind: (lastLevel?.bigBlind || 0) * 2 || 50,
      ante: (lastLevel?.ante || 0) * 2 || 0,
      duration: lastLevel?.duration || 20,
      isBreak: false
    }];
    setLocalLevels(recalculateLevels(newLevels));
  };

  const addBreak = () => {
    const newLevels = [...localLevels, {
      level: 0,
      blinds: 0,
      bigBlind: 0,
      ante: 0,
      duration: 15,
      isBreak: true
    }];
    setLocalLevels(recalculateLevels(newLevels));
  };

  const removeLevel = (index: number) => {
    const newLevels = [...localLevels];
    newLevels.splice(index, 1);
    setLocalLevels(recalculateLevels(newLevels));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newLevels = [...localLevels];
    const draggedItem = newLevels[draggedIndex];
    newLevels.splice(draggedIndex, 1);
    newLevels.splice(dropIndex, 0, draggedItem);

    setLocalLevels(recalculateLevels(newLevels));
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, payoutSplit: localPayouts });
    onSaveLevels(localLevels);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-[#2A2A2A] border-none shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Tournament Settings</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 border-b border-black/10 dark:border-white/10 pb-2 mt-4">
          <Button variant={tab === 'general' ? 'default' : 'ghost'} onClick={() => setTab('general')} className="h-8">General</Button>
          <Button variant={tab === 'payouts' ? 'default' : 'ghost'} onClick={() => setTab('payouts')} className="h-8">Payouts</Button>
          <Button variant={tab === 'blinds' ? 'default' : 'ghost'} onClick={() => setTab('blinds')} className="h-8">Blinds</Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto py-4 pr-2 space-y-4">
            
            {tab === 'general' && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalPlayers" className="text-right">Total Players</Label>
                  <Input id="totalPlayers" name="totalPlayers" type="number" value={formData.totalPlayers} onChange={handleChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="playersRemaining" className="text-right">Remaining</Label>
                  <Input id="playersRemaining" name="playersRemaining" type="number" value={formData.playersRemaining} onChange={handleChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startingStack" className="text-right">Start Stack</Label>
                  <Input id="startingStack" name="startingStack" type="number" value={formData.startingStack} onChange={handleChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rebuys" className="text-right">Rebuys</Label>
                  <Input id="rebuys" name="rebuys" type="number" value={formData.rebuys} onChange={handleChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="addons" className="text-right">Add-ons</Label>
                  <Input id="addons" name="addons" type="number" value={formData.addons} onChange={handleChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="buyIn" className="text-right">Buy-in (€)</Label>
                  <Input id="buyIn" name="buyIn" type="number" value={formData.buyIn} onChange={handleChange} className="col-span-3" />
                </div>
              </div>
            )}

            {tab === 'payouts' && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4 pb-4 border-b border-black/10 dark:border-white/10">
                  <Label htmlFor="paidPlaces" className="text-right font-bold">Paid Places</Label>
                  <Input id="paidPlaces" type="number" min="1" value={localPayouts.length} onChange={handlePlacesChange} className="col-span-3" />
                </div>
                
                <div className="space-y-3">
                  {localPayouts.map((payout, index) => (
                    <div key={index} className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-muted-foreground">{index + 1}. Place (%)</Label>
                      <Input 
                        type="number" 
                        value={payout} 
                        onChange={(e) => handlePayoutChange(index, e.target.value)} 
                        className="col-span-3" 
                      />
                    </div>
                  ))}
                </div>
                <div className="text-right text-sm text-muted-foreground mt-2">
                  Total: {localPayouts.reduce((a, b) => a + b, 0)}%
                </div>
              </div>
            )}

            {tab === 'blinds' && (
              <div className="space-y-4">
                <div className="flex justify-end gap-2 mb-2">
                  <Button type="button" variant="outline" size="sm" onClick={addBreak}><Plus className="w-4 h-4 mr-1" /> Break</Button>
                  <Button type="button" variant="default" size="sm" onClick={addLevel}><Plus className="w-4 h-4 mr-1" /> Level</Button>
                </div>
                
                <div className="flex items-center gap-2 px-2 pb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <div className="w-4"></div>
                  <div className="w-8 text-center">#</div>
                  <div className="flex-1 grid grid-cols-4 gap-2">
                    <div>SB</div>
                    <div>BB</div>
                    <div>Ante</div>
                    <div>Min</div>
                  </div>
                  <div className="w-8"></div>
                </div>

                <div className="space-y-2">
                  {localLevels.map((level, index) => (
                    <div 
                      key={index} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-move transition-colors ${draggedIndex === index ? 'opacity-50 bg-muted' : ''} ${level.isBreak ? 'bg-muted/50 border-dashed' : 'border-black/10 dark:border-white/10'}`}
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                      <div className="w-8 text-center font-bold text-xs text-muted-foreground">
                        {level.isBreak ? 'B' : level.level}
                      </div>
                      
                      {level.isBreak ? (
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-sm font-medium">Break Duration:</span>
                          <Input type="number" value={level.duration} onChange={(e) => handleLevelChange(index, 'duration', Number(e.target.value))} className="w-20 h-8" />
                          <span className="text-sm text-muted-foreground">min</span>
                        </div>
                      ) : (
                        <div className="flex-1 grid grid-cols-4 gap-2">
                          <Input type="number" placeholder="SB" value={level.blinds} onChange={(e) => handleLevelChange(index, 'blinds', Number(e.target.value))} className="h-8" title="Small Blind" />
                          <Input type="number" placeholder="BB" value={level.bigBlind} onChange={(e) => handleLevelChange(index, 'bigBlind', Number(e.target.value))} className="h-8" title="Big Blind" />
                          <Input type="number" placeholder="Ante" value={level.ante} onChange={(e) => handleLevelChange(index, 'ante', Number(e.target.value))} className="h-8" title="Ante" />
                          <Input type="number" placeholder="Min" value={level.duration} onChange={(e) => handleLevelChange(index, 'duration', Number(e.target.value))} className="h-8" title="Duration (min)" />
                        </div>
                      )}
                      
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeLevel(index)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
          
          <DialogFooter className="mt-4 pt-4 border-t border-black/10 dark:border-white/10">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
