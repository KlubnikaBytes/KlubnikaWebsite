import React, { useState, useEffect, useRef } from 'react';

const LeaveDetailsModal = ({ isOpen, onClose, leaveId, currentUser, onLeaveUpdated }) => {
    const [details, setDetails] = useState(null);
    const [messages, setMessages] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    
    // Status update states
    const [actionLoading, setActionLoading] = useState(false);
    const [reviewNotes, setReviewNotes] = useState('');

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && leaveId) {
            fetchDetails();
        }
    }, [isOpen, leaveId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchDetails = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`/api/admin/leaves/${leaveId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch details');
            
            setDetails(data.leave);
            setMessages(data.messages);
            setHistory(data.history);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`/api/admin/leaves/${leaveId}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: newMessage })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to send message');
            
            setMessages([...messages, data.chatMessage]);
            setNewMessage('');
        } catch (err) {
            alert('Error sending message: ' + err.message);
        } finally {
            setSending(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        setActionLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`/api/admin/leaves/${leaveId}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus, reviewNotes })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update status');
            
            setDetails(data.leave);
            setReviewNotes('');
            onLeaveUpdated();
            fetchDetails(); // Reload to get system messages & history
        } catch (err) {
            alert('Error updating leave: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (!isOpen) return null;

    const getStatusBadge = (status) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Approved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
            'Rejected': 'bg-rose-100 text-rose-800 border-rose-200',
            'Need More Info': 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
    };

    const isAdmin = currentUser.role === 'CEO' || currentUser.role === 'HR';
    const canReview = isAdmin && (currentUser.role === 'CEO' || details?.employee?.role !== 'CEO');

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-end bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className={`bg-slate-50 w-full max-w-2xl h-full flex flex-col shadow-2xl shadow-indigo-900/20 animate-in slide-in-from-right duration-300 relative border-l border-slate-200`}>
                
                {/* Header */}
                <div className="h-20 px-6 sm:px-8 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl items-center justify-center border border-indigo-100 shadow-sm">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Leave Details</h2>
                            {details && (
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-bold flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                    Ref: <span className="uppercase tracking-widest">{details._id.substring(0,8)}</span>
                                </p>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all border border-transparent hover:border-slate-200">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : details ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                        
                        {/* Information Cards */}
                        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                            {/* Employee Info */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors"></div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md border-2 border-white">
                                            {details.employee.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-extrabold text-slate-900">{details.employee.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wide">{details.employee.role}</span>
                                                <span className="text-xs text-slate-400 font-medium">&bull; {details.employee.employeeId}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="self-end sm:self-auto">{getStatusBadge(details.status)}</div>
                                </div>
                                
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 relative z-10">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
                                        <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                                            Type
                                        </p>
                                        <p className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                                            {details.type}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
                                        <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                            Duration
                                        </p>
                                        <p className="font-extrabold text-slate-800 text-sm">
                                            {new Date(details.endDate).getTime() === new Date(details.startDate).getTime() 
                                                ? '1 Day' 
                                                : `${Math.ceil((new Date(details.endDate) - new Date(details.startDate)) / (1000 * 60 * 60 * 24)) + 1} Days`}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner col-span-2 group-hover:bg-white transition-colors">
                                        <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                            Dates
                                        </p>
                                        <p className="font-bold text-slate-700 text-sm bg-white border border-slate-200 px-3 py-1.5 rounded-lg inline-block">
                                            {new Date(details.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})} <span className="text-slate-400 mx-2">→</span> {new Date(details.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-100 relative z-10">
                                    <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/></svg>
                                        Reason provided
                                    </p>
                                    <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-5 rounded-2xl border border-indigo-100/50 text-slate-700 text-sm leading-relaxed shadow-sm font-medium">
                                        {details.reason}
                                    </div>
                                    {details.attachmentUrl && (
                                        <a href={details.attachmentUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors border border-indigo-100">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                                            View Documentation Attachment
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Admin Review Action Panel */}
                            {canReview && details.status === 'Pending' && (
                                <div className="bg-white rounded-3xl p-6 shadow-md border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <h4 className="flex items-center gap-2 text-sm font-extrabold text-slate-800 mb-4 uppercase tracking-widest relative z-10">
                                        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        Review Panel
                                    </h4>
                                    <div className="relative z-10">
                                        <textarea 
                                            className="w-full rounded-2xl border-slate-200 border p-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 resize-none transition-all mb-5 shadow-inner bg-slate-50 focus:bg-white"
                                            rows="2"
                                            placeholder="Add internal notes or feedback for the employee... (Optional)"
                                            value={reviewNotes}
                                            onChange={(e) => setReviewNotes(e.target.value)}
                                        ></textarea>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button 
                                                disabled={actionLoading}
                                                onClick={() => handleStatusUpdate('Approved')}
                                                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-emerald-500/20 transition-all focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                                Approve
                                            </button>
                                            <button 
                                                disabled={actionLoading}
                                                onClick={() => handleStatusUpdate('Need More Info')}
                                                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-amber-500/20 transition-all focus:ring-4 focus:ring-amber-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                Ask Info
                                            </button>
                                            <button 
                                                disabled={actionLoading}
                                                onClick={() => handleStatusUpdate('Rejected')}
                                                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-rose-500/20 transition-all focus:ring-4 focus:ring-rose-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Thread View */}
                            <div className="bg-white flex-1 min-h-[400px] flex flex-col rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between shadow-sm z-10 relative">
                                    <h4 className="font-extrabold text-slate-800 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                                        Conversation Thread
                                    </h4>
                                    <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest shadow-sm">{messages.length} Messages</span>
                                </div>
                                
                                <div className="p-6 flex-1 overflow-y-auto space-y-5 bg-gradient-to-b from-slate-50/50 to-white relative custom-scrollbar">
                                    {messages.length === 0 ? (
                                        <div className="text-center text-slate-400 py-16 flex flex-col items-center h-full justify-center">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                                                <svg className="w-8 h-8 opacity-50 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                                            </div>
                                            <p className="text-sm font-bold text-slate-500">No messages yet.</p>
                                            <p className="text-xs font-medium mt-1">Start the conversation below.</p>
                                        </div>
                                    ) : (
                                        messages.map((msg, idx) => (
                                            <div key={idx} className={`flex flex-col ${msg.isSystemMessage ? 'items-center my-8' : msg.sender._id === currentUser.id ? 'items-end' : 'items-start'}`}>
                                                {msg.isSystemMessage ? (
                                                    <div className="bg-slate-100/80 backdrop-blur-sm px-5 py-2.5 rounded-full text-xs text-slate-500 font-bold flex items-center gap-2 border border-slate-200 shadow-sm relative z-10">
                                                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                        {msg.message}
                                                    </div>
                                                ) : (
                                                    <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${msg.sender._id === currentUser.id ? 'items-end' : 'items-start'} group`}>
                                                        <div className={`flex items-center gap-2 mb-1.5 px-1 ${msg.sender._id === currentUser.id ? 'flex-row-reverse' : 'flex-row'}`}>
                                                            <span className="text-[11px] font-extrabold text-slate-700">{msg.sender.name}</span>
                                                            <span className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 uppercase font-bold tracking-widest ${
                                                                msg.sender.role === 'CEO' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                                                msg.sender.role === 'HR' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                                                                'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                            }`}>
                                                                {msg.sender.role === 'CEO' && <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" /></svg>}
                                                                {msg.sender.role}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                            </span>
                                                        </div>
                                                        <div className={`px-5 py-3.5 text-sm shadow-md font-medium relative ${
                                                            msg.sender._id === currentUser.id 
                                                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-sm' 
                                                            : 'bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-sm'
                                                        }`}>
                                                            {msg.message}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} className="h-4" />
                                </div>
                                
                                <div className="p-4 sm:p-5 bg-white border-t border-slate-100 shrink-0 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] relative z-10">
                                    <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
                                        <div className="flex-1 relative">
                                            <input 
                                                type="text" 
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Write a message or reply..."
                                                className="w-full rounded-2xl border-slate-200 border bg-slate-50 focus:bg-white pl-4 pr-12 py-3.5 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-inner"
                                            />
                                            {/* Optional: Add attachment button icon here if needed in future */}
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={sending || !newMessage.trim()}
                                            className="bg-indigo-600 text-white rounded-2xl w-14 h-14 shrink-0 flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none hover:-translate-y-0.5 shadow-md shadow-indigo-500/30"
                                        >
                                            {sending ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <svg className="w-5 h-5 ml-0.5 -mt-0.5 transform rotate-[-45deg]" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default LeaveDetailsModal;
