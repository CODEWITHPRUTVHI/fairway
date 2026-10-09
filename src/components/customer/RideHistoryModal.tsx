import React from 'react';
import { ArrowLeft, Clock, DollarSign, Star, Users, CheckCircle } from 'lucide-react';
import { PastRideHistoryItem } from '../../types';

interface RideHistoryModalProps {
  rides: PastRideHistoryItem[];
  onClose: () => void;
}

export const RideHistoryModal: React.FC<RideHistoryModalProps> = ({ rides, onClose }) => {
  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col p-4 animate-in fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-sm font-bold text-slate-900">Nashik Auto Ride History</h3>
        <div className="w-5" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pt-3">
        {rides.map((ride) => (
          <div
            key={ride.id}
            className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">{ride.date}</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                ₹{ride.actualPaidFare.toFixed(2)}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <span className="w-2 h-2 rounded-full bg-slate-900" />
                <span>{ride.originName} → {ride.destName}</span>
              </div>
              <div className="text-[11px] text-slate-500 pl-3.5">
                Driver: {ride.driverName} ({ride.vehicleName})
              </div>
            </div>

            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-800 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Saved ₹{ride.savings.toFixed(2)} via Auto Pooling
              </span>
              <span className="text-emerald-700 font-bold">
                +{ride.detourPercent}% detour
              </span>
            </div>

            {ride.coPassengers.length > 0 && (
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <Users className="w-3 h-3" />
                <span>Travelled with: {ride.coPassengers.join(', ')}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
              <span>Solo Meter Price: ₹{ride.soloFare.toFixed(2)}</span>
              <div className="flex items-center text-amber-500">
                {'★'.repeat(ride.ratingGiven)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
