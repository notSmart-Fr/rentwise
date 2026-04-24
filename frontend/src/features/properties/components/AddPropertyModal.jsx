import React from 'react';
import { usePropertyForm } from '../hooks/usePropertyForm';

const AddPropertyModal = ({ isOpen, onClose, onSuccess }) => {
  const { formData, isLoading, error, handleChange, handleFileChange, handleSubmit, localFilesCount } = usePropertyForm(null, () => {
    onSuccess();
    onClose();
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-center bg-black/60 backdrop-blur-soft animate-fade-in overflow-hidden">
      {/* Scroll Container */}
      <div className="w-full h-full overflow-y-auto px-4 py-12 md:py-20 flex justify-center custom-scrollbar">

        {/* Modal Card */}
        <div className="relative w-full max-w-2xl bg-[#0F172A]/80 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl animate-zoom-in h-fit overflow-hidden">

          {/* Header - Sticky Style */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-white/5 backdrop-blur-md border-b border-white/5">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">List New Property</h2>
              <p className="text-text-secondary text-xs uppercase tracking-widest mt-1 font-semibold">Step-by-step onboarding</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:bg-danger/20 hover:text-danger hover:border-danger/30"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-danger/30 bg-danger/10 text-danger text-sm font-medium animate-shake">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {error}
              </div>
            )}

            {/* Section 1: General Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 rounded-full bg-primary"></div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">General Information</h3>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary pl-1">Property Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern Apartment in Gulshan"
                  className="input-field py-3.5"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary pl-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Tell tenants about your beautiful home..."
                  className="input-field min-h-[100px] py-3 resize-none"
                ></textarea>
              </div>
            </div>

            {/* Section 2: Financials & Capacity */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 rounded-full bg-accent"></div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">Rent & Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary pl-1 flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /></svg>
                    Rent (৳)
                  </label>
                  <input
                    type="number"
                    name="rent_amount"
                    value={formData.rent_amount}
                    onChange={handleChange}
                    className="input-field py-3"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary pl-1 flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 20v-2a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v2" /><rect x="7" y="4" width="10" height="11" rx="2" /></svg>
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="input-field py-3"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary pl-1 flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 6 6.5 3.5a1.5 1.5 0 1 0-2.12 2.12L6 8" /><path d="M2 11h20" /><path d="M2 11v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8" /><path d="M7 11v10" /><path d="M17 11v10" /></svg>
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="input-field py-3"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-6">
                <label className="text-xs font-semibold text-text-secondary pl-1 flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                  Architectural Type
                </label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  className="input-field py-3 appearance-none cursor-pointer"
                >
                  <option value="Apartment">RentWise Apartment</option>
                  <option value="Penthouse">Luxury Penthouse</option>
                  <option value="Villa">Modern Villa</option>
                  <option value="Townhouse">Executive Townhouse</option>
                  <option value="Studio">Minimalist Studio</option>
                </select>
              </div>
            </div>

            {/* Section 3: Location */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 rounded-full bg-secondary"></div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">Location</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary pl-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field py-3"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary pl-1">Area</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. Banani"
                    className="input-field py-3"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary pl-1">Specific Address (Optional)</label>
                <input
                  type="text"
                  name="address_text"
                  value={formData.address_text}
                  onChange={handleChange}
                  placeholder="Block/Road/House Number"
                  className="input-field py-3"
                />
              </div>
            </div>

            {/* Section 4: Media */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 rounded-full bg-white/40"></div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">Media</h3>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary pl-1 flex items-center justify-between">
                  <span>Upload Images</span>
                  <span className="text-[10px] text-primary uppercase font-bold">{localFilesCount} files selected</span>
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*"
                  />
                  <div className="w-full border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center bg-white/2 group-hover:bg-white/5 group-hover:border-primary/30 transition-all">
                    <svg className="w-8 h-8 text-slate-500 mb-2 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-bold text-white">Drop images or click to browse</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">High-res photos recommended</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary pl-1 flex items-center justify-between">
                  <span>External Image URLs (Legacy)</span>
                  <span className="text-[10px] text-text-secondary opacity-50 uppercase">One URL per line</span>
                </label>
                <textarea
                  name="image_urls"
                  value={formData.image_urls}
                  onChange={handleChange}
                  rows="2"
                  placeholder="https://images.com/property-1.jpg"
                  className="input-field min-h-[60px] py-3 font-mono text-[10px]"
                ></textarea>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="pt-10 flex flex-col-reverse md:flex-row gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 px-6 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-4 px-8 rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:bg-primary-hover hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Listing Property...</span>
                  </div>
                ) : 'Complete Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyModal;