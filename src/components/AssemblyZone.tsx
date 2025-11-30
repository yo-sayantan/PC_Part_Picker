import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { BuildState } from '@/lib/compatibility';
import { X } from 'lucide-react';

interface SlotProps {
    id: string;
    label: string;
    part?: any;
    onRemove?: () => void;
    accepts: string;
    disabled?: boolean;
}

function Slot({ id, label, part, onRemove, accepts, disabled }: SlotProps) {
    const { isOver, setNodeRef } = useDroppable({
        id,
        data: { accepts },
        disabled: disabled || !!part
    });

    return (
        <div
            ref={setNodeRef}
            className={`
        relative border-2 rounded-lg p-3 min-h-[80px] flex items-center justify-center
        transition-all
        ${part ? 'border-green-600 bg-green-900/20' : 'border-dashed border-neutral-700'}
        ${isOver && !part ? 'border-yellow-500 bg-yellow-900/20 scale-105' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
        >
            {part ? (
                <div className="flex items-center gap-3 w-full">
                    {part.imageUrl && (
                        <img src={part.imageUrl} alt={part.name} className="w-12 h-12 object-contain" />
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{part.name}</div>
                        <div className="text-xs text-neutral-400 truncate">
                            ₹{part.price?.toLocaleString('en-IN')}
                        </div>
                    </div>
                    {onRemove && (
                        <button
                            onClick={onRemove}
                            className="p-1 hover:bg-red-600/20 rounded transition-colors"
                            title="Remove"
                        >
                            <X className="w-4 h-4 text-red-400" />
                        </button>
                    )}
                </div>
            ) : (
                <span className="text-xs text-neutral-500">{label}</span>
            )}
        </div>
    );
}

interface AssemblyZoneProps {
    build: BuildState;
    onRemove: (category: string, index?: number) => void;
}

export function AssemblyZone({ build, onRemove }: AssemblyZoneProps) {
    // Calculate max slots based on motherboard
    const maxRamSlots = (build.motherboard?.specs as any)?.ram_slots || 4;
    const maxM2Slots = (build.motherboard?.specs as any)?.m2_slots || 2;
    const maxCaseFans = 6; // Standard case supports ~6 fans

    // Check if build is complete enough to "light up"
    const isComplete = build.case && build.motherboard && build.cpu && build.ram && build.ram.length > 0 && build.psu;

    return (
        <div className={`
      w-full max-w-5xl p-6 space-y-6 overflow-y-auto max-h-screen relative transition-all duration-1000
      ${isComplete ? 'shadow-[0_0_100px_rgba(0,255,255,0.2)]' : ''}
    `}>
            {/* Background Image Overlay */}
            <div
                className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: 'url(https://placehold.co/1000x1000/1a1a1a/333?text=PC+Case+Interior)' }}
            />

            {/* RGB Glow Effect Overlay */}
            {isComplete && (
                <div className="absolute inset-0 z-0 pointer-events-none animate-pulse bg-gradient-to-r from-red-500/10 via-green-500/10 to-blue-500/10 blur-3xl" />
            )}

            <h2 className={`
        text-3xl font-bold text-center mb-6 bg-clip-text text-transparent relative z-10
        ${isComplete ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-text' : 'bg-gradient-to-r from-blue-400 to-purple-500'}
      `}>
                {isComplete ? '✨ SYSTEM ONLINE ✨' : 'Build Your PC'}
            </h2>

            {/* Case Section - Foundation */}
            <div className="relative z-10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 rounded-xl p-6 border border-neutral-700 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                        <span className="text-2xl">🏗️</span> PC Case
                    </h3>
                </div>
                <Slot
                    id="case-drop"
                    label="Drop your PC Case here"
                    part={build.case}
                    onRemove={() => onRemove('case')}
                    accepts="case"
                />
                {build.case && (
                    <div className="mt-2 text-xs text-neutral-400">
                        Max GPU: {build.case.specs?.max_gpu_length}mm • Max Cooler: {build.case.specs?.max_cpu_cooler_height}mm
                    </div>
                )}
            </div>

            {/* Motherboard Section - Platform */}
            <div className="bg-gradient-to-br from-purple-900/20 to-neutral-900/50 rounded-xl p-6 border border-purple-700/30">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
                        <span className="text-2xl">⚡</span> Motherboard
                    </h3>
                </div>
                <Slot
                    id="motherboard-drop"
                    label="Drop your Motherboard here"
                    part={build.motherboard}
                    onRemove={() => onRemove('motherboard')}
                    accepts="motherboard"
                />
                {build.motherboard && (
                    <div className="mt-2 text-xs text-neutral-400">
                        {build.motherboard.specs?.socket} • {build.motherboard.specs?.memory_type} • {build.motherboard.specs?.form_factor}
                    </div>
                )}
            </div>

            {/* CPU Section */}
            <div className="bg-gradient-to-br from-blue-900/20 to-neutral-900/50 rounded-xl p-6 border border-blue-700/30">
                <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🧠</span> Processor (CPU)
                </h3>
                <Slot
                    id="cpu-drop"
                    label="Drop your CPU here"
                    part={build.cpu}
                    onRemove={() => onRemove('cpu')}
                    accepts="cpu"
                    disabled={!build.motherboard}
                />
                {!build.motherboard && (
                    <div className="mt-2 text-xs text-yellow-400">⚠️ Add motherboard first</div>
                )}
            </div>

            {/* CPU Cooler Section */}
            <div className="bg-gradient-to-br from-indigo-900/20 to-neutral-900/50 rounded-xl p-6 border border-indigo-700/30">
                <h3 className="text-lg font-semibold text-indigo-400 mb-4 flex items-center gap-2">
                    <span className="text-2xl">❄️</span> CPU Cooler
                </h3>
                <Slot
                    id="cooler-drop"
                    label="Drop your Cooler here"
                    part={build.cooler}
                    onRemove={() => onRemove('cooler')}
                    accepts="cooler"
                    disabled={!build.cpu}
                />
                {!build.cpu && (
                    <div className="mt-2 text-xs text-yellow-400">⚠️ Add CPU first</div>
                )}
            </div>

            {/* RAM Slots - Multiple slots */}
            <div className="bg-gradient-to-br from-yellow-900/20 to-neutral-900/50 rounded-xl p-6 border border-yellow-700/30">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎯</span> RAM Slots ({build.ram?.length || 0}/{maxRamSlots})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: maxRamSlots }).map((_, i) => (
                        <Slot
                            key={`ram-${i}`}
                            id={`ram-drop-${i}`}
                            label={`Slot ${i + 1}`}
                            part={build.ram?.[i]}
                            onRemove={() => onRemove('ram', i)}
                            accepts="ram"
                            disabled={!build.motherboard}
                        />
                    ))}
                </div>
                {!build.motherboard && (
                    <div className="mt-2 text-xs text-yellow-400">⚠️ Add motherboard first</div>
                )}
            </div>

            {/* M.2 SSD Slots */}
            <div className="bg-gradient-to-br from-cyan-900/20 to-neutral-900/50 rounded-xl p-6 border border-cyan-700/30">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                    <span className="text-2xl">💾</span> M.2 SSD Slots ({build.storage?.length || 0}/{maxM2Slots})
                </h3>
                <div className="grid grid-cols-1 gap-3">
                    {Array.from({ length: maxM2Slots }).map((_, i) => (
                        <Slot
                            key={`ssd-${i}`}
                            id={`storage-drop-${i}`}
                            label={`M.2 Slot ${i + 1}`}
                            part={build.storage?.[i]}
                            onRemove={() => onRemove('storage', i)}
                            accepts="storage"
                            disabled={!build.motherboard}
                        />
                    ))}
                </div>
                {!build.motherboard && (
                    <div className="mt-2 text-xs text-yellow-400">⚠️ Add motherboard first</div>
                )}
            </div>

            {/* GPU Section */}
            <div className="bg-gradient-to-br from-green-900/20 to-neutral-900/50 rounded-xl p-6 border border-green-700/30">
                <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎮</span> Graphics Card (GPU)
                </h3>
                <Slot
                    id="gpu-drop-0"
                    label="Drop your GPU here (PCIe x16)"
                    part={build.gpu?.[0]}
                    onRemove={() => onRemove('gpu', 0)}
                    accepts="gpu"
                    disabled={!build.motherboard}
                />
                {!build.motherboard && (
                    <div className="mt-2 text-xs text-yellow-400">⚠️ Add motherboard first</div>
                )}
            </div>

            {/* PSU Section */}
            <div className="bg-gradient-to-br from-red-900/20 to-neutral-900/50 rounded-xl p-6 border border-red-700/30">
                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                    <span className="text-2xl">⚡</span> Power Supply (PSU)
                </h3>
                <Slot
                    id="psu-drop"
                    label="Drop your PSU here"
                    part={build.psu}
                    onRemove={() => onRemove('psu')}
                    accepts="psu"
                    disabled={!build.case}
                />
                {build.psu && (
                    <div className="mt-2 text-xs text-neutral-400">
                        {(build.psu.specs as any)?.wattage}W • {(build.psu.specs as any)?.efficiency} • {(build.psu.specs as any)?.modular}
                    </div>
                )}
                {!build.case && (
                    <div className="mt-2 text-xs text-yellow-400">⚠️ Add case first</div>
                )}
            </div>
        </div>
    );
}
