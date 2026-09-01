import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  AlertTriangle,
  Info,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickCheatSheetModal: React.FC<QuickCheatSheetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const discordLinks = [
    { name: 'Android App', url: 'https://join.packsify.com/psc-app-android' },
    { name: 'iOS / Web App', url: 'https://join.packsify.com/psc-app-ios' },
    { name: 'Help Center', url: 'https://join.packsify.com/helpcenterdc' },
    { name: 'Tutorial Walkthrough', url: 'https://join.packsify.com/orderwalkthroughdc' },
    { name: 'Trustpilot', url: 'https://join.packsify.com/psc-trustpilot' },
    { name: 'Is Packsify Safe', url: 'https://join.packsify.com/play-smarter' },
    { name: 'Ban Protection Policy', url: 'https://join.packsify.com/is-packsify-safe' },
    { name: 'Packsify Blogs (game context)', url: 'https://www.packsify.com/blogs' },
  ];

  const intercomLinks = [
    { 
      name: 'Android App', 
      url: 'https://play.google.com/store/apps/details?id=com.mycompany.packsify?utm_source=intercom&utm_medium=customer-support' 
    },
    { 
      name: 'iOS / Web App', 
      url: 'https://app.packsify.com/?utm_source=intercom&utm_medium=customer-support' 
    },
    { 
      name: 'Help Center', 
      url: 'https://help-center.packsify.com/en/?utm_source=intercom&utm_medium=customer-support' 
    },
    { 
      name: 'Tutorial Walkthrough', 
      url: 'https://www.youtube.com/watch?v=3nLuUgiF55g?utm_source=intercom&utm_medium=customer-support' 
    },
    { 
      name: 'Trustpilot', 
      url: 'https://www.trustpilot.com/review/packsify.com?utm_source=intercom&utm_medium=customer-support' 
    },
    { 
      name: 'Is Packsify Safe', 
      url: 'https://www.packsify.com/blogs/is-packsify-safe?utm_source=intercom&utm_medium=customer-support' 
    },
    { 
      name: 'Packsify Blogs (game context)', 
      url: 'https://www.packsify.com/blogs?utm_source=intercom&utm_medium=customer-support' 
    }
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    confetti({ particleCount: 20, spread: 35 });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>3. UTM Link Reference Table</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Golden Rule: Always Use Attributed Links
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Standard reference sheet for CS & Support team agents
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            <strong>Reminder for all agents:</strong> Always copy the appropriate attributed link below based on channel. Never share a bare, un-tracked URL.
          </span>
        </div>

        {/* Tables Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Section 1: Rerouting from Discord */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-200 flex items-center gap-1.5">
                <span>Rerouting from Discord (CS Shortlinks)</span>
              </h3>
              <span className="text-[11px] text-zinc-400">
                join.packsify.com domain format
              </span>
            </div>

            <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
              <table className="w-full text-left">
                <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 font-semibold">
                  <tr>
                    <th className="py-2.5 px-4 w-1/3">Destination / Context</th>
                    <th className="py-2.5 px-4">Attributed Link</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {discordLinks.map((item, idx) => {
                    const key = `dc-${idx}`;
                    const isCopied = copiedKey === key;
                    return (
                      <tr key={idx} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-zinc-200">
                          {item.name}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-blue-400 text-xs">
                          {item.url}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => handleCopy(item.url, key)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              isCopied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                            }`}
                          >
                            {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Rerouting from Intercom / Conversations */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-blue-400 flex items-center gap-1.5">
                <span>Rerouting from Intercom / Conversations (Growth UTM)</span>
              </h3>
              <span className="text-[11px] text-zinc-400">
                utm_source=intercom&utm_medium=customer-support
              </span>
            </div>

            <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
              <table className="w-full text-left">
                <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 font-semibold">
                  <tr>
                    <th className="py-2.5 px-4 w-1/3">Destination / Context</th>
                    <th className="py-2.5 px-4">Attributed UTM Link</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {intercomLinks.map((item, idx) => {
                    const key = `intercom-${idx}`;
                    const isCopied = copiedKey === key;
                    return (
                      <tr key={idx} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-zinc-200">
                          {item.name}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-zinc-300 text-xs truncate max-w-[340px]">
                          {item.url}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => handleCopy(item.url, key)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              isCopied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20'
                            }`}
                          >
                            {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{isCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800 bg-zinc-950 shrink-0">
          <div className="text-[11px] text-zinc-500">
            Packsify Internal Documentation • Version 2026.3
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            Close Sheet
          </button>
        </div>

      </div>
    </div>
  );
};
