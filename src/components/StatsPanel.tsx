import React, { useState } from 'react';
import { BuildState, CompatibilityResult } from '@/lib/compatibility';
import { EmailModal } from './EmailModal';

export function StatsPanel({ build, compatibility }: { build: BuildState, compatibility: CompatibilityResult }) {
    const [showEmail, setShowEmail] = useState(false);

    // Calculate total price
    const totalPrice = Object.values(build).flat().reduce((sum: number, part: any) => {
        return sum + (part?.price || 0);
    }, 0);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">Build Status</h3>
                <div className={`p-3 rounded ${compatibility.valid ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                    {compatibility.valid ? 'Compatible' : 'Issues Found'}
                </div>
                {compatibility.messages.map((msg, idx) => (
                    <div key={idx} className={`text-xs mt-1 ${msg.type === 'error' ? 'text-red-400' : msg.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'}`}>
                        • {msg.text}
                    </div>
                ))}
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Estimated Power</h3>
                <div className="text-2xl font-mono">{compatibility.estimatedWattage}W</div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Total Price</h3>
                <div className="text-3xl font-bold text-green-400">₹{totalPrice.toLocaleString('en-IN')}</div>
            </div>

            <button
                onClick={() => setShowEmail(true)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded font-bold transition-colors"
            >
                Email Build Summary
            </button>

            {showEmail && <EmailModal build={build} onClose={() => setShowEmail(false)} />}
        </div>
    );
}
