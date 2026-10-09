import React, { useState } from 'react';
import { ArrowLeft, User, Phone, Shield, Plus, Trash2, Check } from 'lucide-react';
import { TrustedContact, UserProfile } from '../../types';
import { SEEDED_PASSENGERS } from '../../data/mockData';

interface ProfileContactsModalProps {
  currentUser: UserProfile;
  trustedContacts: TrustedContact[];
  onSwitchUser: (user: UserProfile) => void;
  onAddContact: (name: string, phone: string, relationship: string) => void;
  onRemoveContact: (id: string) => void;
  onClose: () => void;
}

export const ProfileContactsModal: React.FC<ProfileContactsModalProps> = ({
  currentUser,
  trustedContacts,
  onSwitchUser,
  onAddContact,
  onRemoveContact,
  onClose,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRel, setNewRel] = useState('Friend');

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    onAddContact(newName.trim(), newPhone.trim(), newRel);
    setNewName('');
    setNewPhone('');
    setShowAddForm(false);
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col p-4 animate-in fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-sm font-bold text-slate-900">Profile & Contacts</h3>
        <div className="w-5" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pt-3">
        {/* User Card */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#FCC016] text-[#1E1E1E] flex items-center justify-center font-bold text-lg">
              {currentUser.name[0]}
            </div>
            <div>
              <h4 className="text-sm font-bold">{currentUser.name}</h4>
              <p className="text-xs text-slate-400">{currentUser.phone}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] bg-amber-400/20 text-[#FCC016] px-1.5 py-0.2 rounded font-semibold">
                  ⭐ {currentUser.rating}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded capitalize">
                  {currentUser.gender}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Switch User Persona */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Switch Demo Passenger Persona
          </span>
          <div className="grid grid-cols-3 gap-2">
            {SEEDED_PASSENGERS.map((p) => (
              <button
                key={p.id}
                onClick={() => onSwitchUser(p)}
                className={`p-2 rounded-xl text-xs border text-center transition-all ${
                  currentUser.id === p.id
                    ? 'border-[#FCC016] bg-amber-50 font-bold text-slate-900 ring-1 ring-[#FCC016]'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div>{p.name}</div>
                <div className="text-[10px] text-slate-400 capitalize">
                  {p.gender}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Trusted Contacts */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Emergency Trusted Contacts
            </span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:text-blue-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Contact</span>
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleCreateContact} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <input
                type="text"
                placeholder="Full Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
              />
              <input
                type="tel"
                placeholder="Phone (+91 9822...)"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
              />
              <select
                value={newRel}
                onChange={(e) => setNewRel(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-none"
              >
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
                <option value="Partner">Partner</option>
              </select>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-slate-900 text-white rounded-lg font-bold"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {trustedContacts.map((c) => (
              <div
                key={c.id}
                className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-sm"
              >
                <div>
                  <h5 className="font-bold text-slate-900">{c.name}</h5>
                  <p className="text-[11px] text-slate-500">{c.phone} · {c.relationship}</p>
                </div>
                <button
                  onClick={() => onRemoveContact(c.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
