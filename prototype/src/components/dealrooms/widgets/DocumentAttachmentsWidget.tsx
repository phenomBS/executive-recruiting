import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Lock, 
  ExternalLink, 
  Paperclip, 
  CheckCircle2, 
  Clock,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { DealRoomAttachment } from '../../../data/dealRoomsData';
import { cn } from '../../../lib/utils';

interface DocumentAttachmentsWidgetProps {
  attachments: DealRoomAttachment[];
  onAddAttachment?: (att: DealRoomAttachment) => void;
  onRemoveAttachment?: (id: string) => void;
  isRecruiterPreview?: boolean;
}

export function DocumentAttachmentsWidget({
  attachments,
  onAddAttachment,
  onRemoveAttachment,
  isRecruiterPreview = false
}: DocumentAttachmentsWidgetProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newFileName, setNewFileName] = useState('');
  const [newCategory, setNewCategory] = useState<DealRoomAttachment['category']>('Strategic Brief');
  const [newConfidential, setNewConfidential] = useState(true);

  const categories = ['All', 'Strategic Brief', 'Legal & NDA', 'Offer Package', 'Benefits & Compensation', 'Board Deck'];

  const filteredAttachments = selectedCategory === 'All' 
    ? attachments 
    : attachments.filter(a => a.category === selectedCategory);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newDoc: DealRoomAttachment = {
      id: `att-${Date.now()}`,
      fileName: newFileName.endsWith('.pdf') ? newFileName : `${newFileName}.pdf`,
      fileSize: `${(Math.random() * 2 + 0.8).toFixed(1)} MB`,
      category: newCategory,
      uploadedAt: 'Today',
      isConfidential: newConfidential,
      downloadCount: 0
    };

    if (onAddAttachment) onAddAttachment(newDoc);
    setNewFileName('');
    setIsUploading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0 shadow-2xs">
            <Paperclip className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Confidential Executive Document Vault
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-800">
                {attachments.length} Documents
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Securely synchronized strategic briefs, audited term sheets, and board presentations.
            </p>
          </div>
        </div>

        {/* Upload Action */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isRecruiterPreview && (
            <button
              type="button"
              onClick={() => setIsUploading(!isUploading)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Cancel Upload' : 'Upload Document'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Upload Form Box */}
        {isUploading && (
          <form onSubmit={handleUploadSubmit} className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-3 animate-fadeIn">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-indigo-700" />
              Add Confidential Executive Document
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input 
                  type="text" 
                  placeholder="Document Title (e.g. 2027_Board_Growth_Deck.pdf)"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as DealRoomAttachment['category'])}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Strategic Brief">Strategic Brief</option>
                  <option value="Legal & NDA">Legal & NDA</option>
                  <option value="Offer Package">Offer Package</option>
                  <option value="Benefits & Compensation">Benefits & Compensation</option>
                  <option value="Board Deck">Board Deck</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={newConfidential} 
                  onChange={(e) => setNewConfidential(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500" 
                />
                <span>Enforce Confidential Watermark on Download</span>
              </label>

              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
              >
                Attach & Synchronize
              </button>
            </div>
          </form>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer",
                selectedCategory === cat 
                  ? "bg-slate-900 text-white" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Attachments List */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
          {filteredAttachments.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No documents currently attached in this category.
            </div>
          ) : (
            filteredAttachments.map((doc) => (
              <div 
                key={doc.id}
                className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {doc.fileName}
                      </span>
                      {doc.isConfidential && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-800 uppercase">
                          <Lock className="w-2.5 h-2.5" /> Confidential
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-medium text-slate-600">{doc.category}</span>
                      <span>·</span>
                      <span>{doc.fileSize}</span>
                      <span>·</span>
                      <span>Uploaded {doc.uploadedAt}</span>
                      <span>·</span>
                      <span>{doc.downloadCount} views</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    type="button"
                    onClick={() => alert(`Simulating secure preview of ${doc.fileName}`)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="View Document"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button 
                    type="button"
                    onClick={() => alert(`Downloading ${doc.fileName} with verified cryptographic watermark`)}
                    className="p-2 rounded-lg text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 transition-colors cursor-pointer"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {onRemoveAttachment && !isRecruiterPreview && (
                    <button 
                      type="button"
                      onClick={() => onRemoveAttachment(doc.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-400 hover:text-rose-600 transition-opacity cursor-pointer"
                      title="Remove Attachment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
