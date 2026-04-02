import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  ClipboardList,
  FileSignature,
  File,
  Coins,
  TrendingUp,
  AlertTriangle,
  Bookmark,
  Briefcase,
  FolderOpen,
  Upload,
  Inbox,
  FileText,
  Image as ImageIcon,
  Building,
  Eye,
  CheckCircle2,
  XCircle,
  Download,
  Clock,
  Info
} from 'lucide-react';

const API = `${import.meta.env.VITE_API_URL}/api/admin/documents`;
const token = () => localStorage.getItem('adminToken');

const STATUS_CONFIG = {
    pending:  { label: 'Pending',  cls: 'bg-amber-50 text-amber-700 border-amber-200',       dot: 'bg-amber-400' },
    verified: { label: 'Verified', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    rejected: { label: 'Rejected', cls: 'bg-rose-50 text-rose-700 border-rose-200',          dot: 'bg-rose-500' },
};

const ROLE_COLORS = {
    'CEO':      'bg-purple-50 text-purple-700 border-purple-100',
    'HR':       'bg-blue-50 text-blue-700 border-blue-100',
    'Employee': 'bg-gray-100 text-gray-700 border-gray-200',
    'Digital Marketing Manager': 'bg-teal-50 text-teal-700 border-teal-100',
};

// Document types HR/CEO can upload on behalf of an employee
const HR_UPLOAD_TYPES = [
    { type: 'Offer Letter' },
    { type: 'Appointment Letter' },
    { type: 'Employment Contract' },
    { type: 'Joining Form' },
    { type: 'Salary Slip' },
    { type: 'Increment Letter' },
    { type: 'Warning Letter' },
    { type: 'Relieving Letter' },
    { type: 'Experience Letter' },
];

export default function DocumentVerification() {
    const [employees, setEmployees]     = useState([]);
    const [loading, setLoading]         = useState(true);
    const [selected, setSelected]       = useState(null);
    const [panelLoading, setPanelLoading] = useState(false);
    const [viewDoc, setViewDoc]         = useState(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [actionState, setActionState] = useState({});
    const [toast, setToast]             = useState(null);
    const [search, setSearch]           = useState('');

    // Upload-for-employee state
    const [showUploadPanel, setShowUploadPanel] = useState(false);
    const [uploadDocType, setUploadDocType]     = useState(HR_UPLOAD_TYPES[0].type);
    const [uploadingForEmp, setUploadingForEmp] = useState(false);
    const hrFileRef = useRef(null);

    useEffect(() => { fetchEmployees(); }, []);

    const fetchEmployees = async () => {
        try {
            const res  = await fetch(`${API}/employees`, { headers: { Authorization: `Bearer ${token()}` } });
            const data = await res.json();
            setEmployees(Array.isArray(data) ? data : []);
        } catch { showToast('Failed to load employees.', 'error'); }
        finally   { setLoading(false); }
    };

    const openEmployee = async (emp) => {
        setPanelLoading(true);
        setSelected(null);
        setShowUploadPanel(false);
        try {
            const res  = await fetch(`${API}/employee/${emp._id}`, { headers: { Authorization: `Bearer ${token()}` } });
            const data = await res.json();
            if (!res.ok) return showToast(data.message || 'Failed to load documents.', 'error');
            setSelected(data);
            setActionState({});
        } catch { showToast('Failed to load documents.', 'error'); }
        finally   { setPanelLoading(false); }
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
        const link = document.createElement('a');
        link.href = doc.fileData.startsWith('data:') ? doc.fileData : `data:${doc.mimeType};base64,${doc.fileData}`;
        link.download = doc.fileName;
        link.click();
    };

    const updateAction = (docId, patch) => {
        setActionState(prev => ({ ...prev, [docId]: { ...prev[docId], ...patch } }));
    };

    const handleVerify = async (docId, status) => {
        const state = actionState[docId] || {};
        if (status === 'rejected' && (!state.remark || !state.remark.trim())) {
            return showToast('Please add a remark before rejecting.', 'error');
        }
        updateAction(docId, { loading: true });
        try {
            const res  = await fetch(`${API}/${docId}/verify`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
                body: JSON.stringify({ status, remark: state.remark || '' }),
            });
            const data = await res.json();
            if (!res.ok) return showToast(data.message || 'Action failed.', 'error');
            showToast(`Document ${status} successfully.`);
            setSelected(prev => ({
                ...prev,
                documents: prev.documents.map(d => d._id === docId ? { ...d, status, remark: state.remark || '' } : d),
            }));
            fetchEmployees();
            updateAction(docId, { loading: false, showRemark: false, remark: '' });
        } catch { showToast('Action failed.', 'error'); }
        finally   { updateAction(docId, { loading: false }); }
    };

    // ── Upload document for employee ──────────────────────────────────────
    const handleHrUploadClick = () => {
        hrFileRef.current.value = '';
        hrFileRef.current.click();
    };

    const handleHrFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !selected) return;

        if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
            return showToast('Only PDF, JPG, and PNG files are allowed.', 'error');
        }
        if (file.size > 5 * 1024 * 1024) {
            return showToast('File size must not exceed 5MB.', 'error');
        }

        setUploadingForEmp(true);
        try {
            const fileData = await toBase64(file);
            const res = await fetch(`${API}/employee/${selected.employee._id}/upload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
                body: JSON.stringify({
                    documentType: uploadDocType,
                    fileName: file.name,
                    mimeType: file.type,
                    fileData,
                }),
            });
            const data = await res.json();
            if (!res.ok) return showToast(data.message || 'Upload failed.', 'error');
            showToast(`"${uploadDocType}" uploaded for ${selected.employee.name}!`);
            // Refresh the employee's document list
            const refreshRes  = await fetch(`${API}/employee/${selected.employee._id}`, { headers: { Authorization: `Bearer ${token()}` } });
            const refreshData = await refreshRes.json();
            if (refreshRes.ok) setSelected(refreshData);
            fetchEmployees();
            setShowUploadPanel(false);
        } catch { showToast('Upload failed. Please try again.', 'error'); }
        finally   { setUploadingForEmp(false); }
    };

    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload  = () => resolve(reader.result);
        reader.onerror = reject;
    });

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const filtered = employees.filter(e =>
        `${e.name} ${e.employeeId} ${e.role}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex gap-6 h-[calc(100vh-8rem)] animate-in fade-in duration-500">

            {/* Hidden file input for HR upload */}
            <input ref={hrFileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleHrFileChange} />

            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold animate-in slide-in-from-top-2 duration-200 ${
                    toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                    <span>{toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}</span> {toast.msg}
                </div>
            )}

            {/* ── Left: Employee List ─────────────────────────────── */}
            <div className="w-80 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-extrabold text-gray-900">Document Verification</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Select an employee to review</p>
                    <div className="mt-3 relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-gray-50"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="w-6 h-6 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-10">No employees found</p>
                    ) : (
                        filtered.map(emp => {
                            const isActive = selected?.employee?._id === emp._id;
                            const counts = emp.docCounts || {};
                            return (
                                <button
                                    key={emp._id}
                                    onClick={() => openEmployee(emp)}
                                    className={`w-full text-left px-4 py-3.5 border-b border-gray-50 transition-colors hover:bg-indigo-50/50 ${isActive ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-500 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                                            {emp.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm truncate">{emp.name}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <p className="text-[10px] text-gray-400 font-medium">{emp.employeeId}</p>
                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${ROLE_COLORS[emp.role] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>{emp.role}</span>
                                            </div>
                                        </div>
                                        {counts.pending > 0 && (
                                            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 border border-amber-200">
                                                {counts.pending} new
                                            </span>
                                        )}
                                    </div>
                                    {counts.total > 0 && (
                                        <div className="flex gap-2 mt-2 ml-12">
                                            <MiniCount label={<CheckCircle2 size={12} className="inline mr-1" />} value={counts.verified} />
                                            <MiniCount label={<Clock size={12} className="inline mr-1" />} value={counts.pending} />
                                            <MiniCount label={<XCircle size={12} className="inline mr-1" />} value={counts.rejected} />
                                        </div>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ── Right: Document Review Panel ───────────────────── */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                {!selected && !panelLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 p-10">
                        <div className="w-20 h-20 rounded-full bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center mb-4"><FolderOpen size={32} className="text-gray-400" /></div>
                        <p className="font-bold text-gray-500 text-lg">No employee selected</p>
                        <p className="text-sm mt-1">Select an employee from the list to review their documents.</p>
                    </div>
                ) : panelLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Panel Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50 shrink-0">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-500 text-white font-bold text-lg flex items-center justify-center shadow">
                                {selected.employee.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-extrabold text-gray-900">{selected.employee.name}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-400">{selected.employee.employeeId}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ROLE_COLORS[selected.employee.role] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                        {selected.employee.role}
                                    </span>
                                </div>
                            </div>
                            <div className="ml-auto flex items-center gap-3">
                                <StatChip label="Total" value={selected.documents.length} color="indigo" />
                                <StatChip label="Pending" value={selected.documents.filter(d => d.status === 'pending').length} color="amber" />
                                <StatChip label="Verified" value={selected.documents.filter(d => d.status === 'verified').length} color="emerald" />
                                <StatChip label="Rejected" value={selected.documents.filter(d => d.status === 'rejected').length} color="rose" />
                                {/* Upload for employee button */}
                                <button
                                    onClick={() => setShowUploadPanel(p => !p)}
                                    className="flex items-center gap-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-sm transition-colors"
                                >
                                    <Upload size={16} /> Upload for Employee
                                </button>
                            </div>
                        </div>

                        {/* HR Upload Panel (collapsible) */}
                        {showUploadPanel && (
                            <div className="px-6 py-4 border-b border-indigo-100 bg-indigo-50/60 animate-in slide-in-from-top-2 duration-200">
                                <h4 className="flex items-center gap-2 text-sm font-extrabold text-indigo-800 mb-3"><Upload size={16} /> Upload Joining / Professional Document</h4>
                                <div className="flex flex-wrap items-end gap-3">
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Document Type</label>
                                        <select
                                            value={uploadDocType}
                                            onChange={e => setUploadDocType(e.target.value)}
                                            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white"
                                        >
                                            {HR_UPLOAD_TYPES.map(t => (
                                                <option key={t.type} value={t.type}>{t.type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">File (PDF / JPG / PNG, max 5MB)</label>
                                        <button
                                            onClick={handleHrUploadClick}
                                            disabled={uploadingForEmp}
                                            className="flex items-center gap-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-5 py-2 rounded-xl shadow-sm transition-colors"
                                        >
                                            {uploadingForEmp ? (
                                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                                            ) : (
                                                <span className="flex items-center gap-2"><FolderOpen size={16} /> Choose & Upload File</span>
                                            )}
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setShowUploadPanel(false)}
                                        className="text-sm text-gray-400 hover:text-gray-600 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <p className="text-xs text-indigo-600 mt-2.5">
                                    <span className="inline-flex"><Info size={16} className="inline mr-1" /></span> Documents uploaded here will appear in the employee's documents page as <strong>auto-verified</strong>.
                                </p>
                            </div>
                        )}

                        {/* Document List */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {selected.documents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                                    <span className="mb-3"><Inbox size={48} className="text-gray-300" /></span>
                                    <p className="font-semibold text-gray-500">No documents uploaded yet</p>
                                    <p className="text-sm mt-1">This employee has not uploaded any documents.</p>
                                </div>
                            ) : (
                                selected.documents.map(doc => {
                                    const sc = STATUS_CONFIG[doc.status];
                                    const state = actionState[doc._id] || {};
                                    const isHRUploaded = doc.uploadedByRole && doc.uploadedByRole !== 'self';
                                    return (
                                        <div key={doc._id} className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 space-y-4">
                                            {/* Doc info row */}
                                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-xl shadow-sm">
                                                        {doc.mimeType === 'application/pdf' ? <FileText size={24} className="text-gray-500" /> : <ImageIcon size={24} className="text-gray-500" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{doc.documentType}</p>
                                                        <p className="text-xs text-gray-400">{doc.fileName} · {formatBytes(doc.fileSize)}</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            {isHRUploaded && doc.uploadedBy
                                                                ? ` · By ${doc.uploadedBy.name} (${doc.uploadedBy.role})`
                                                                : doc.verifiedBy ? ` · Reviewed by ${doc.verifiedBy.name || 'HR'}` : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {isHRUploaded && (
                                                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                                                            <Building size={12} /> Company
                                                        </span>
                                                    )}
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${sc.cls}`}>
                                                        <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                                                        {sc.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* HR remark (if any) */}
                                            {doc.remark && (
                                                <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5 text-sm text-rose-700">
                                                    <strong>Remark:</strong> {doc.remark}
                                                </div>
                                            )}

                                            {/* Action row — hide verify/reject for HR-uploaded docs */}
                                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                                <button
                                                    onClick={() => handleView(doc._id)}
                                                    disabled={viewLoading}
                                                    className="flex items-center gap-1.5 text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:text-indigo-700 hover:border-indigo-200 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
                                                >
                                                    <Eye size={16} /> View Document
                                                </button>

                                                {!isHRUploaded && doc.status !== 'verified' && (
                                                    <button
                                                        onClick={() => handleVerify(doc._id, 'verified')}
                                                        disabled={state.loading}
                                                        className="flex items-center gap-1.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl shadow-sm transition-colors disabled:opacity-60"
                                                    >
                                                        {state.loading ? <Spinner /> : <CheckCircle2 size={16} />} Approve
                                                    </button>
                                                )}

                                                {!isHRUploaded && doc.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => updateAction(doc._id, { showRemark: !state.showRemark })}
                                                        className="flex items-center gap-1.5 text-sm font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2 rounded-xl transition-colors"
                                                    >
                                                        <XCircle size={16} /> Reject
                                                    </button>
                                                )}
                                            </div>

                                            {/* Remark input for rejection */}
                                            {state.showRemark && (
                                                <div className="space-y-2 pt-1 animate-in slide-in-from-top-2 duration-200">
                                                    <label className="text-xs font-semibold text-gray-600">Rejection Remark <span className="text-rose-500">*</span></label>
                                                    <textarea
                                                        value={state.remark || ''}
                                                        onChange={e => updateAction(doc._id, { remark: e.target.value })}
                                                        placeholder="Explain why this document is being rejected..."
                                                        rows={2}
                                                        className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 resize-none"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleVerify(doc._id, 'rejected')}
                                                            disabled={state.loading}
                                                            className="flex items-center gap-1.5 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl shadow-sm transition-colors disabled:opacity-60"
                                                        >
                                                            {state.loading ? <Spinner /> : 'Confirm Rejection'}
                                                        </button>
                                                        <button
                                                            onClick={() => updateAction(doc._id, { showRemark: false, remark: '' })}
                                                            className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* View/Preview Modal */}
            {(viewLoading || viewDoc) && (
                <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewDoc(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
                            <h3 className="font-bold text-gray-900">{viewDoc?.fileName || 'Loading...'}</h3>
                            <div className="flex items-center gap-3">
                                {viewDoc && (
                                    <button
                                        onClick={() => handleDownload(viewDoc)}
                                        className="flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
                                    >
                                        <Download size={16} /> Download
                                    </button>
                                )}
                                <button onClick={() => setViewDoc(null)} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100 min-h-[300px]">
                            {viewLoading ? (
                                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                            ) : viewDoc?.mimeType === 'application/pdf' ? (
                                <iframe src={viewDoc.fileData} title={viewDoc.fileName} className="w-full h-[65vh] rounded-lg border border-gray-200" />
                            ) : (
                                <img src={viewDoc?.fileData} alt={viewDoc?.fileName} className="max-w-full max-h-[65vh] object-contain rounded-lg shadow" />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Small helpers ──────────────────────────────────────────────────────────
function MiniCount({ label, value }) {
    if (value === 0) return null;
    return <span className="text-[10px] text-gray-500 font-medium">{label} {value}</span>;
}

function StatChip({ label, value, color }) {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        emerald:'bg-emerald-50 text-emerald-700 border-emerald-100',
        amber:  'bg-amber-50 text-amber-700 border-amber-100',
        rose:   'bg-rose-50 text-rose-700 border-rose-100',
    };
    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${colors[color]}`}>
            {value} <span className="opacity-60 font-medium">{label}</span>
        </div>
    );
}

function Spinner() {
    return <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />;
}

function formatBytes(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
