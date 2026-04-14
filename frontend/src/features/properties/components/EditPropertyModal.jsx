import React from 'react';
import { usePropertyForm } from '../hooks/usePropertyForm';

const EditPropertyModal = ({ isOpen, onClose, onSuccess, property }) => {
  const { formData, isLoading, error, handleChange, handleSubmit } = usePropertyForm(property, () => {
    onSuccess();
    onClose();
  });

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-center bg-black/60 backdrop-blur-soft animate-fade-in overflow-hidden">
      {/* Scroll Container */}
      <div className="w-full h-full overflow-y-auto px-4 py-12 md:py-20 flex justify-center custom-scrollbar">

        {/* Modal Card */}
        <div className="relative w-full max-w-2xl bg-[#0F172A]/80 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl animate-zoom-in h-fit overflow-hidden">

          {/* Header - Sticky Style */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-white/5 backdrop-blur-md border-b border-white/5">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Edit Property</h2>
              <p className="text-text-secondary text-xs uppercase tracking-widest mt-1 font-semibold">Update listing details</p>
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

            {/* Section 1: Visibility Toggle */}
            <div className="glass-panel p-6 flex items-center justify-between border-dashed bg-primary/5">
              <div>
                <h4 className="font-bold text-white">Listing Availability</h4>
                <p className="text-xs text-text-secondary">Temporarily hide this property from search results.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={(e) => handleChange({ target: { name: 'is_available', value: e.target.checked } })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:inset-s-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Section 2: General Info */}
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
                  className="input-field min-h-[100px] py-3 resize-none"
                ></textarea>
              </div>
            </div>

            {/* Section 3: Financials & Capacity */}
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
            </div>

            {/* Section 4: Location */}
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
                    className="input-field py-3"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary pl-1">Specific Address</label>
                <input
                  type="text"
                  name="address_text"
                  value={formData.address_text}
                  onChange={handleChange}
                  className="input-field py-3"
                />
              </div>
            </div>

            {/* Section 5: Media */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 rounded-full bg-white/40"></div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">Media</h3>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary pl-1">Image URLs (One per line)</label>
                <textarea
                  name="image_urls"
                  value={formData.image_urls}
                  onChange={handleChange}
                  rows="3"
                  className="input-field min-h-[120px] py-3 font-mono text-xs"
                ></textarea>
              </div>
            </div>

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
                className="flex-1 py-4 px-8 rounded-2xl bg-accent text-[#0F172A] font-black shadow-lg shadow-accent/20 hover:bg-accent/80 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 border-2 border-[#0F172A]/30 border-t-[#0F172A] rounded-full animate-spin"></div>
                    <span>Saving Changes...</span>
                  </div>
                ) : 'Save Updates'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPropertyModal;
