import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [vStatus, setVStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [vFile, setVFile] = useState(null);
  const [docType, setDocType] = useState('NID');
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    const fetchVStatus = async () => {
      try {
        const status = await authService.getVerificationStatus();
        setVStatus(status);
      } catch (err) {
        console.error('Failed to fetch verification status:', err);
      }
    };
    fetchVStatus();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updatedUser = await authService.updateProfile(formData);
      updateUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
      return;
    }

    setIsUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const { avatar_url } = await authService.uploadAvatar(file);
      // Update local user state with new avatar
      updateUser({ ...user, avatar_url });
      setMessage({ type: 'success', text: 'Avatar updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to upload avatar' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!vFile) return;

    setIsVerifying(true);
    try {
      await authService.requestVerification(docType, vFile);
      setVStatus({ status: 'PENDING', submitted_at: new Date().toISOString() });
      setMessage({ type: 'success', text: 'Verification request submitted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to submit verification' });
    } finally {
      setIsVerifying(false);
    }
  };


  return (
    <div className="container mx-auto px-6 py-32 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">Profile Settings</h1>
        <p className="text-text-secondary text-sm uppercase tracking-widest mt-2">Manage your identity and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 flex flex-col items-center text-center">
            <div className="relative w-32 h-32 mb-6 group cursor-pointer" onClick={handleAvatarClick}>
              <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary to-accent animate-pulse-slow opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-full h-full rounded-full border-4 border-white/10 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-4xl font-black text-white">
                    {user?.full_name?.[0]}
                  </div>
                )}
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-white text-xs font-bold uppercase tracking-tighter">Change</span>
                </div>
              </div>
              
              {/* Spinner for uploading */}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                   <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />

            <h2 className="text-xl font-bold text-white">{user?.full_name}</h2>
            <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mt-1">{user?.email}</p>
            
            <div className="mt-8 pt-8 border-t border-white/5 w-full">
               <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user?.is_verified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  {user?.is_verified ? '✓ Verified Account' : '⚠ Unverified'}
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              {message.text && (
                <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                  message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-danger/10 text-danger border border-danger/20'
                }`}>
                  <span className="text-lg">{message.type === 'success' ? '✓' : '⚠'}</span>
                  {message.text}
                </div>
              )}

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-primary/50 transition-all placeholder:text-slate-600"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-white/2 border border-white/5 rounded-2xl px-6 py-4 text-slate-500 font-medium cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-600 ml-1 italic">Email cannot be changed for security reasons.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-primary/50 transition-all placeholder:text-slate-600"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto px-12 py-4 bg-primary rounded-2xl text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {isLoading ? 'Saving Changes...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Verification Section */}
          {!user?.is_verified && (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <span className="text-2xl">🛡️</span> Identity Verification
                </h3>
                <p className="text-sm text-text-secondary mt-2">Verified users get a badge and priority listing status.</p>
              </div>

              {vStatus?.status === 'PENDING' ? (
                <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 animate-pulse">⏳</div>
                  <div>
                    <p className="text-sm font-bold text-amber-400 uppercase tracking-widest">Verification Pending</p>
                    <p className="text-xs text-amber-400/60 mt-1">Submitted on {new Date(vStatus.submitted_at).toLocaleDateString()}. We will notify you once reviewed.</p>
                  </div>
                </div>
              ) : vStatus?.status === 'REJECTED' ? (
                <div className="space-y-6">
                  <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <p className="text-sm font-bold text-red-400 uppercase tracking-widest">Verification Rejected</p>
                    <p className="text-xs text-red-400/60 mt-1">{vStatus.notes || 'Please try again with a clearer document.'}</p>
                  </div>
                  <button onClick={() => setVStatus(null)} className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Try Again</button>
                </div>
              ) : (
                <form onSubmit={handleVerificationSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Document Type</label>
                      <select 
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-primary/50 transition-all appearance-none"
                      >
                        <option value="NID" className="bg-slate-900">National ID Card</option>
                        <option value="Passport" className="bg-slate-900">Passport</option>
                        <option value="TradeLicense" className="bg-slate-900">Trade License (Owner)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Upload File</label>
                      <input 
                        type="file" 
                        onChange={(e) => setVFile(e.target.files[0])}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-[14px] text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-primary file:text-white hover:file:bg-primary/80" 
                        accept="image/*,.pdf"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isVerifying || !vFile}
                    className="btn btn-secondary w-full md:w-auto px-8 py-3 text-xs font-black uppercase tracking-widest border-white/10 disabled:opacity-50"
                  >
                    {isVerifying ? 'Submitting...' : 'Submit for Verification'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfileSettings;
