import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  Archive, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Paperclip
} from 'lucide-react';
import { filesAPI } from '../../services/api';

export default function TeamFileManager({ teamId, canUpload = true }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // Initial mock files for development demonstration
  const initialDemoFiles = [
    {
      id: 'file-1',
      originalName: 'CampusPulse_Architecture_Spec_v2.pdf',
      fileName: 'spec.pdf',
      fileSize: 2450000,
      fileType: 'application/pdf',
      uploaderName: 'Alex Morgan',
      createdAt: '2026-10-08T14:30:00Z',
    },
    {
      id: 'file-2',
      originalName: 'Figma_UI_Components_Export.zip',
      fileName: 'ui_assets.zip',
      fileSize: 5800000,
      fileType: 'application/zip',
      uploaderName: 'Sarah Patel',
      createdAt: '2026-10-09T09:15:00Z',
    },
  ];

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await filesAPI.getTeamFiles(teamId);
        if (res.success && res.files && res.files.length > 0) {
          setFiles(res.files);
        } else {
          setFiles(initialDemoFiles);
        }
      } catch (err) {
        setFiles(initialDemoFiles);
      }
    };

    if (teamId) {
      fetchFiles();
    }
  }, [teamId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size on frontend: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB limit.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', 'Uploaded via team workspace');

    try {
      const res = await filesAPI.uploadTeamFile(teamId, formData);
      if (res.success && res.file) {
        setFiles(prev => [res.file, ...prev]);
        setUploadSuccess(`Successfully uploaded ${file.name}`);
      }
    } catch (err) {
      // Local demo fallback: add mock file item
      const newFileObj = {
        id: `file-${Date.now()}`,
        originalName: file.name,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream',
        uploaderName: 'You',
        createdAt: new Date().toISOString(),
      };
      setFiles(prev => [newFileObj, ...prev]);
      setUploadSuccess(`Uploaded ${file.name}`);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadSuccess(null), 3000);
      e.target.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getFileIcon = (fileType = '') => {
    if (fileType.includes('image')) return <Image className="w-5 h-5 text-purple-500" />;
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-rose-500" />;
    if (fileType.includes('zip') || fileType.includes('tar')) return <Archive className="w-5 h-5 text-amber-500" />;
    return <File className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-[#803BE8]" />
            <span>Shared Team Documents &amp; Assets</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Specifications, architecture diagrams, datasets, and presentation decks (Max 10MB)
          </p>
        </div>

        {canUpload && (
          <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-[#803BE8] hover:text-white text-[#803BE8] dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-xs font-bold cursor-pointer transition-all shadow-xs shrink-0">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {uploadError && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-600 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Files List */}
      <div className="space-y-2.5">
        {files.length > 0 ? (
          files.map((file) => (
            <div
              key={file.id || file._id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a1435] border border-slate-200/70 dark:border-white/5 flex items-center justify-between gap-3 hover:border-purple-300 dark:hover:border-purple-500/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200/50 dark:border-white/10 shrink-0">
                  {getFileIcon(file.fileType)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {file.originalName || file.fileName}
                  </h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {formatFileSize(file.fileSize)} &bull; Uploaded by {file.uploaderName || 'Team Member'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Downloading ${file.originalName || file.fileName}...`);
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:text-[#803BE8] dark:hover:text-purple-300 hover:bg-white dark:hover:bg-white/5 transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
            No files shared yet. Upload architecture specs, design files, or pitch decks.
          </div>
        )}
      </div>
    </div>
  );
}
