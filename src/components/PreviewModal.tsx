import React from 'react';
import { X, ExternalLink, Play, Copy, Check, QrCode } from 'lucide-react';
import { AssetItem } from '../types';

interface PreviewModalProps {
  asset: AssetItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenQr: (link: string, title: string) => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  asset,
  isOpen,
  onClose,
  onOpenQr,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !asset) return null;

  const handleCopyCS = () => {
    navigator.clipboard.writeText(asset.csLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-950/70">
          <div className="min-w-0 pr-4">
            <h3 className="text-base font-bold text-zinc-100 truncate">
              {asset.title}
            </h3>
            {asset.campaignName && (
              <p className="text-xs text-blue-400 truncate">
                {asset.campaignName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Preview Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {asset.videoEmbedUrl ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800">
              <iframe
                src={asset.videoEmbedUrl}
                title={asset.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          ) : asset.previewUrl ? (
            <div className="relative w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 max-h-[380px] flex items-center justify-center">
              <img
                src={asset.previewUrl}
                alt={asset.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[360px]"
              />
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-zinc-950 border border-zinc-800 text-center text-zinc-400">
              <p className="text-sm">Direct link asset without visual media.</p>
            </div>
          )}

          {/* Description */}
          {asset.description && (
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
              <span className="font-semibold text-zinc-400 block mb-1">Agent Guidelines:</span>
              {asset.description}
            </div>
          )}

          {/* Attributed URLs */}
          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-sans font-bold text-zinc-400 block">CS Team Link:</span>
                <span className="text-zinc-200 truncate block">{asset.csLink}</span>
              </div>
              <a
                href={asset.csLink}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 shrink-0"
                title="Open Link"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-sans font-bold text-blue-400 block">Growth Team Attributed Link:</span>
                <span className="text-zinc-200 truncate block">{asset.growthLink}</span>
              </div>
              <a
                href={asset.growthLink}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white shrink-0"
                title="Open Link"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-zinc-800 bg-zinc-950/70">
          <button
            onClick={() => onOpenQr(asset.growthLink || asset.csLink, asset.title)}
            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate Mobile QR Code</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
