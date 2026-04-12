import React from 'react';
import { usePropertyForm } from '../hooks/usePropertyForm';

const EditPropertyModal = ({ isOpen, onClose, onSuccess, property }) => {
  const { formData, isLoading, error, handleChange, handleSubmit } = usePropertyForm(property, () => {
    onSuccess();
    onClose();
  });

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 z-90 flex justify-center bg-bg-base/60 backdrop-blur-md animate-fade-in">
      <div className="w-full h-full overflow-y-auto px-6 pb-20 pt-[120px]">
        <div className="relative w-full max-w-2xl mx-auto rounded-2xl border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10 animate-zoom-in">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Edit Property</h2>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-white/5 text-2xl text-slate-400 transition-all hover:rotate-90 hover:bg-red-500 hover:text-white"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/20 p-4 text-sm font-medium text-red-400">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Property Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern Apartment in Gulshan"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Area</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Rent (৳)</label>
                <input
                  type="number"
                  name="rent_amount"
                  value={formData.rent_amount}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 py-4 sm:col-span-2">
                <label className="relative flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name="is_available"
                    checked={formData.is_available}
                    onChange={handleChange}
                    className="peer h-6 w-6 cursor-pointer appearance-none rounded border border-white/10 bg-white/5 transition-all checked:bg-primary"
                  />
                  <span className="pointer-events-none absolute left-0 right-0 top-0 bottom-0 flex scale-0 items-center justify-center text-white transition-transform peer-checked:scale-100">
                    ✓
                  </span>
                </label>
                <span className="text-sm font-bold text-white">Property is available for lease</span>
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Address Details</label>
                <input
                  type="text"
                  name="address_text"
                  value={formData.address_text}
                  onChange={handleChange}
                  placeholder="Specific location/street name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full resize-y min-h-[120px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Image URLs (One per line)</label>
                <textarea
                  name="image_urls"
                  value={formData.image_urls}
                  onChange={handleChange}
                  rows="4"
                  className="w-full resize-y min-h-[120px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white transition-all focus:border-primary focus:bg-white/10 focus:outline-none font-mono"
                ></textarea>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4 border-t border-white/5 pt-8">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 px-6 py-3 font-bold text-slate-400 transition-all hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-primary px-8 py-3 font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPropertyModal;
