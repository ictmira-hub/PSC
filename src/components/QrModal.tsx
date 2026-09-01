import React from 'react';
import { X, QrCode, Copy, Check, Download, ExternalLink } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  url,
  title,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !url) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(
    url
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-5 h-5" />
        </div>

        <h3 className="text-base font-bold text-zinc-100 mb-1">
          Scan on Mobile
        </h3>
        <p className="text-xs text-zinc-400 mb-4 line-clamp-1">
          {title}
        </p>

        {/* QR Code Canvas Frame */}
        <div className="bg-white p-3.5 rounded-xl inline-block shadow-lg mx-auto mb-4 border border-zinc-300">
          <img
            src={qrImageUrl}
            alt={`QR code for ${title}`}
            className="w-48 h-48 block"
          />
        </div>

        <p className="text-[11px] font-mono text-zinc-400 truncate px-2 mb-4 bg-zinc-950 py-1.5 rounded-lg border border-zinc-800">
          {url}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied URL!' : 'Copy Link'}</span>
          </button>
          <a
            href={qrImageUrl}
            download={`packsify-qr-${encodeURIComponent(title)}.png`}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
            title="Download QR Image"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};
