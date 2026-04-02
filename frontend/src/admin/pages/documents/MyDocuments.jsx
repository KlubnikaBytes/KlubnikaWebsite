import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  IdCard,
  CreditCard,
  Landmark,
  FileText,
  BarChart,
  GraduationCap,
  Briefcase,
  ClipboardList,
  Eye,
  Trash2,
  RefreshCw,
  Upload,
  FolderOpen,
  Building,
  Download,
  Info,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

const API = `${import.meta.env.VITE_API_URL}/api/admin/documents`;
const token = () => localStorage.getItem('adminToken');

const DOCUMENT_CATEGORIES = [
    { type: 'Profile Photo',              icon: <ImageIcon size={24} className="text-indigo-600" />,  multiple: false, desc: 'Passport-size photo or any professional headshot' },
    { type: 'Aadhaar Card',               icon: <IdCard size={24} className="text-indigo-600" />,  multiple: false, desc: 'Front and back side in one file' },
    { type: 'PAN Card',                   icon: <CreditCard size={24} className="text-indigo-600" />,  multiple: false, desc: 'PAN card issued by Income Tax Department' },
    { type: 'Bank Details Document',      icon: <Landmark size={24} className="text-indigo-600" />,  multiple: false, desc: 'Passbook front page or cancelled cheque' },
    { type: '10th Marksheet',             icon: <FileText size={24} className="text-indigo-600" />,  multiple: false, desc: 'Class X board marksheet' },
    { type: '12th Marksheet',             icon: <FileText size={24} className="text-indigo-600" />,  multiple: false, desc: 'Class XII board marksheet' },
    { type: 'Semester Results',           icon: <BarChart size={24} className="text-indigo-600" />,  multiple: true,  desc: 'Upload each semester result separately' },
    { type: 'Degree Certificate',         icon: <GraduationCap size={24} className="text-indigo-600" />,  multiple: false, desc: 'Final degree / provisional certificate' },
    { type: 'Experience Proof',           icon: <Briefcase size={24} className="text-indigo-600" />,  multiple: false, desc: 'Offer letter, experience letter, or relieving letter' },
    { type: 'Internship Certificate',     icon: <ClipboardList size={24} className="text-indigo-600" />,  multiple: false, desc: 'Any internship completion certificate' },
];

const STATUS_CONFIG = {
    pending:  { label: 'Pending Review', cls: 'bg-amber-50 text-amber-700 border-amber-200',  dot: 'bg-amber-400' },
    verified: { label: 'Verified',       cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    rejected: { label: 'Rejected',       cls: 'bg-rose-50 text-rose-700 border-rose-200',     dot: 'bg-rose-500' },
};

export default function MyDocuments() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [uploading, setUploading] = useState(null); // documentType being uploaded
    const [viewDoc, setViewDoc]     = useState(null); // { fileData, mimeType, fileName }
    const [viewLoading, setViewLoading] = useState(false);
    const [toast, setToast]         = useState(null);
    const fileInputRef = useRef(null);
    const [pendingUpload, setPendingUpload] = useState(null); // { type }

    useEffect(() => { fetchDocuments(); }, []);

    const fetchDocuments = async () => {
        try {
            const res = await fetch(`${API}/mine`, { headers: { Authorization: `Bearer ${token()}` } });
            const data = await res.json();
            setDocuments(Array.isArray(data) ? data : []);
        } catch { showToast('Failed to load documents.', 'error'); }
        finally   { setLoading(false); }
    };

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Get documents for a given type
    const docsOfType = (type) => documents.filter(d => d.documentType === type && (!d.uploadedByRole || d.uploadedByRole === 'self'));

    // HR/CEO-uploaded documents visible to employee
    const hrUploadedDocs = documents.filter(d => d.uploadedByRole && d.uploadedByRole !== 'self');

    const handleUploadClick = (type) => {
        setPendingUpload({ type });
        fileInputRef.current.value = '';
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !pendingUpload) return;

        // Client-side validation
        if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
            return showToast('Only PDF, JPG, and PNG files are allowed.', 'error');
        }
        if (file.size > 5 * 1024 * 1024) {
            return showToast('File size must not exceed 5MB.', 'error');
        }

        setUploading(pendingUpload.type);
        try {
            const fileData = await toBase64(file);
            const res = await fetch(`${API}/upload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
                body: JSON.stringify({
                    documentType: pendingUpload.type,
                    fileName: file.name,
                    mimeType: file.type,
                    fileData,
                }),
            });
            const data = await res.json();
            if (!res.ok) return showToast(data.message || 'Upload failed.', 'error');
            showToast(`${pendingUpload.type} uploaded successfully!`);
            await fetchDocuments();
        } catch { showToast('Upload failed. Please try again.', 'error'); }
        finally   { setUploading(null); setPendingUpload(null); }
    };

    const handleView = async (docId) => {
        setViewLoading(true);
        try {
            const res  = await fetch(`${API}/file/${docId}`, { headers: { Authorization: `Bearer ${token()}` } });
            const data = await res.json();
            if (!res.ok) return showToast(data.message || 'Failed to load file.', 'error');
            setViewDoc(data);
        } catch { showToast('Failed to load file.', 'error'); }
        finally   { setViewLoading(false); }
    };

    const handleDownload = (doc) => {
        if (!doc.fileData) return;
        const link = document.createElement('a');
        link.href = doc.fileData.startsWith('data:') ? doc.fileData : `data:${doc.mimeType};base64,${doc.fileData}`;
        link.download = doc.fileName;
        link.click();
    };

    const handleDelete = async (docId, type) => {
        if (!window.confirm(`Delete this ${type} document?`)) return;
        try {
            const res = await fetch(`${API}/${docId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
            const data = await res.json();
            if (!res.ok) return showToast(data.message || 'Delete failed.', 'error');
            showToast('Document deleted.');
            setDocuments(prev => prev.filter(d => d._id !== docId));
        } catch { showToast('Delete failed.', 'error'); }
    };

    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload  = () => resolve(reader.result);
        reader.onerror = reject;
    });

    const totalDocs     = documents.filter(d => !d.uploadedByRole || d.uploadedByRole === 'self').length;
    const verifiedCount = documents.filter(d => (!d.uploadedByRole || d.uploadedByRole === 'self') && d.status === 'verified').length;
    const pendingCount  = documents.filter(d => (!d.uploadedByRole || d.uploadedByRole === 'self') && d.status === 'pending').length;
    const rejectedCount = documents.filter(d => (!d.uploadedByRole || d.uploadedByRole === 'self') && d.status === 'rejected').length;

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />

            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold animate-in slide-in-from-top-2 duration-200 ${
                    toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                    <span>{toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}</span>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Documents</h1>
                        <p className="text-gray-500 text-sm mt-1">Upload and manage your personal & professional documents</p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <StatPill label="Total"    value={totalDocs}     color="indigo" />
                        <StatPill label="Verified"  value={verifiedCount} color="emerald" />
                        <StatPill label="Pending"   value={pendingCount}  color="amber" />
                        <StatPill label="Rejected"  value={rejectedCount} color="rose" />
                    </div>
                </div>
            </div>

            {/* Info banner */}
            <div className="bg-blue-50 border border-blue-100 text-blue-700 rounded-xl px-5 py-3.5 text-sm flex items-start gap-3">
                <span className="text-lg mt-0.5"><Info size={20} className="text-blue-600" /></span>
                <span>Accepted formats: <strong>PDF, JPG, PNG</strong> — max <strong>5MB</strong> per file. 
                Documents marked <strong>Rejected</strong> can be re-uploaded after correction.</span>
            </div>

            {/* Document Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {DOCUMENT_CATEGORIES.map(cat => {
                    const catDocs = docsOfType(cat.type);
                    const isUploading = uploading === cat.type;

                    return (
                        <div key={cat.type} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                            {/* Card Header */}
                            <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                                <span>{cat.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 text-sm truncate">{cat.type}</p>
                                    <p className="text-xs text-gray-400 mt-0.5 leading-tight">{cat.desc}</p>
                                </div>
                                {cat.multiple && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full shrink-0">Multi</span>
                                )}
                            </div>

                            {/* Card Body — uploaded docs */}
                            <div className="flex-1 px-5 py-4 space-y-3">
                                {catDocs.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-5 text-center">
                                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-2 border border-dashed border-gray-200 text-gray-300 text-xl">+</div>
                                        <p className="text-xs text-gray-400 font-medium">No document uploaded yet</p>
                                    </div>
                                ) : (
                                    catDocs.map(doc => {
                                        const sc = STATUS_CONFIG[doc.status];
                                        return (
                                            <div key={doc._id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 space-y-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="text-gray-400 shrink-0">
                                                            {doc.mimeType === 'application/pdf' ? <FileText size={16} /> : <ImageIcon size={16} />}
                                                        </span>
                                                        <p className="text-xs font-semibold text-gray-700 truncate">{doc.fileName}</p>
                                                    </div>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border shrink-0 ${sc.cls}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                                        {sc.label}
                                                    </span>
                                                </div>

                                                {doc.remark && (
                                                    <div className="bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 text-xs text-rose-700">
                                                        <strong>HR Remark:</strong> {doc.remark}
                                                    </div>
                                                )}

                                                <p className="text-[10px] text-gray-400">
                                                    Uploaded: {new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    {doc.verifiedAt && ` · Reviewed: ${new Date(doc.verifiedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
                                                </p>

                                                <div className="flex gap-2 pt-1">
                                                    <button
                                                        onClick={() => handleView(doc._id)}
                                                        className="flex flex-1 items-center justify-center gap-1.5 text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:text-indigo-700 hover:border-indigo-200 hover:bg-indigo-50 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        <Eye size={14} /> View
                                                    </button>
                                                    {doc.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleDelete(doc._id, doc.documentType)}
                                                            className="flex items-center justify-center text-xs font-semibold bg-white border border-gray-200 text-rose-500 hover:text-rose-700 hover:border-rose-200 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Card Footer — Upload button */}
                            <div className="px-5 py-3.5 border-t border-gray-50 bg-gray-50/30">
                                <button
                                    onClick={() => handleUploadClick(cat.type)}
                                    disabled={isUploading}
                                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all
                                        bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isUploading ? (
                                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                                    ) : (
                                        <>{catDocs.length > 0 && !cat.multiple ? <><RefreshCw size={16} /> Replace</> : <><Upload size={16} /> Upload</>}</>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Documents from HR / Company ──────────────────────────────── */}
            {hrUploadedDocs.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-100" />
                        <span className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest"><FolderOpen size={16} /> Documents from HR / Company</span>
                        <div className="h-px flex-1 bg-gray-100" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {hrUploadedDocs.map(doc => {
                            const sc = STATUS_CONFIG[doc.status] || STATUS_CONFIG['verified'];
                            return (
                                <div key={doc._id} className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden flex flex-col">
                                    <div className="px-5 py-4 border-b border-indigo-50 bg-indigo-50/50 flex items-center gap-3">
                                        <span className="text-indigo-600">{doc.mimeType === 'application/pdf' ? <FileText size={24} /> : <ImageIcon size={24} />}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 text-sm truncate">{doc.documentType}</p>
                                            <p className="text-xs text-gray-400 mt-0.5 leading-tight">{doc.fileName}</p>
                                        </div>
                                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 shrink-0"><Building size={12} /> Company</span>
                                    </div>
                                    <div className="flex-1 px-5 py-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${sc.cls}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                                {sc.label}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-400">
                                            Added: {new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                        <div className="flex gap-2 pt-1">
                                            <button
                                                onClick={() => handleView(doc._id)}
                                                className="flex items-center justify-center gap-1.5 flex-1 text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:text-indigo-700 hover:border-indigo-200 hover:bg-indigo-50 py-1.5 rounded-lg transition-colors"
                                            >
                                                <Eye size={14} /> View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* View/Preview Modal */}
            {(viewLoading || viewDoc) && (
                <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setViewDoc(null); }}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
                            <h3 className="font-bold text-gray-900">{viewDoc?.fileName || 'Loading...'}</h3>
                            <div className="flex items-center gap-3">
                                {viewDoc && (
                                    <button
                                        onClick={() => handleDownload(viewDoc)}
                                        className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
                                    >
                                        <Download size={16} /> Download
                                    </button>
                                )}
                                <button onClick={() => { setViewDoc(null); }} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100 min-h-[300px]">
                            {viewLoading ? (
                                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                            ) : viewDoc?.mimeType === 'application/pdf' ? (
                                <iframe
                                    src={viewDoc.fileData}
                                    title={viewDoc.fileName}
                                    className="w-full h-[65vh] rounded-lg border border-gray-200"
                                />
                            ) : (
                                <img
                                    src={viewDoc?.fileData}
                                    alt={viewDoc?.fileName}
                                    className="max-w-full max-h-[65vh] object-contain rounded-lg shadow"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatPill({ label, value, color }) {
    const colors = {
        indigo:  'bg-indigo-50 text-indigo-700 border-indigo-100',
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        amber:   'bg-amber-50 text-amber-700 border-amber-100',
        rose:    'bg-rose-50 text-rose-700 border-rose-100',
    };
    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${colors[color]}`}>
            <span className="text-base">{value}</span>
            <span className="opacity-70">{label}</span>
        </div>
    );
}
