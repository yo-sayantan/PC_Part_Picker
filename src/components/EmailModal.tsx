import React, { useState } from 'react';
import { BuildState } from '@/lib/compatibility';

export function EmailModal({ build, totalPrice, estimatedWattage, onClose }: { build: BuildState, totalPrice: number, estimatedWattage: number, onClose: () => void }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSend = async () => {
        setStatus('sending');
        try {
            const parts = Object.values(build).flat().map((p: any) => ({
                category: (p.category || 'Component').charAt(0).toUpperCase() + (p.category || 'Component').slice(1),
                name: p.name,
                price: p.price || 0,
                retailer: p.retailer || 'Unknown'
            }));

            const res = await fetch('/api/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    buildData: {
                        parts,
                        totalPrice,
                        estimatedWattage
                    }
                })
            });

            if (res.ok) {
                setStatus('success');
                setTimeout(onClose, 2000);
            } else {
                setStatus('error');
            }
        } catch (e) {
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-neutral-800 p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Email Build Summary</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-2 rounded bg-neutral-700 mb-4"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-neutral-400 hover:text-white">Cancel</button>
                    <button
                        onClick={handleSend}
                        disabled={status === 'sending'}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50"
                    >
                        {status === 'sending' ? 'Sending...' : 'Send'}
                    </button>
                </div>
                {status === 'success' && <div className="text-green-400 mt-2">Sent successfully!</div>}
                {status === 'error' && <div className="text-red-400 mt-2">Failed to send.</div>}
            </div>
        </div>
    );
}
