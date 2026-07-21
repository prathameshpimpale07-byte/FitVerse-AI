import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/services';
import { FaCamera, FaUser, FaSave, FaTimes, FaCropAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Cropper from 'react-easy-crop';
import getCroppedImg, { blobUrlToBase64 } from '../../utils/cropImage';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || 'male',
    height: user?.height || '',
    weight: user?.weight || '',
    fitnessGoal: user?.fitnessGoal || 'general_fitness',
  });

  // Avatar and Cropping State
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── Image Selection & Cropping ──
  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setIsCropModalOpen(true);
    }
  };

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropImage = async () => {
    try {
      setIsCropping(true);
      const croppedImageBlobUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      const base64Image = await blobUrlToBase64(croppedImageBlobUrl);
      
      setAvatarPreview(base64Image);
      setIsCropModalOpen(false);
      setImageSrc(null);
    } catch (e) {
      console.error(e);
      toast.error('Failed to crop image');
    } finally {
      setIsCropping(false);
    }
  };

  const cancelCrop = () => {
    setIsCropModalOpen(false);
    setImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Save Profile ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, avatar: avatarPreview };
      const data = await userService.updateProfile(payload);
      updateUser(data.user);
      toast.success('Profile updated successfully! 🎉');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Update your personal information and avatar to keep your profile fresh.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* ── Left Column: Avatar Card ── */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-4 h-max">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl rounded-full" />
            
            <div className="relative inline-block group cursor-pointer mb-6" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden flex items-center justify-center relative">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <FaUser className="text-4xl text-slate-300 dark:text-slate-600" />
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaCamera className="text-white text-2xl mb-1" />
                  <span className="text-white text-xs font-bold uppercase tracking-widest">Upload</span>
                </div>
              </div>
              
              <button className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 border-2 border-white dark:border-slate-900">
                <FaCamera size={14} />
              </button>
              
              <input type="file" ref={fileInputRef} accept="image/*" onChange={onFileChange} className="hidden" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1 leading-tight">{user?.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-4">{user?.email}</p>
            
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-black uppercase tracking-wider">
                {user?.role}
              </span>
              <span className="px-3 py-1 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-500/20 rounded-lg text-xs font-black uppercase tracking-wider">
                {form.fitnessGoal.replace('_', ' ')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Right Column: Edit Form ── */}
        <motion.form 
          onSubmit={handleSubmit} 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="md:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Profile Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider mb-2">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium" />
            </div>
            
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider mb-2">Phone Number</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium" />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider mb-2">Age</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="25"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium" />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider mb-2">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium appearance-none">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider mb-2">Height (cm)</label>
              <input type="number" name="height" value={form.height} onChange={handleChange} placeholder="175"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium" />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider mb-2">Weight (kg)</label>
              <input type="number" name="weight" value={form.weight} onChange={handleChange} placeholder="70"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium" />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider mb-2">Primary Fitness Goal</label>
            <div className="relative">
              <select name="fitnessGoal" value={form.fitnessGoal} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-medium appearance-none">
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
                <option value="flexibility">Flexibility</option>
                <option value="general_fitness">General Fitness</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button type="submit" disabled={loading} className="w-full sm:w-auto px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><FaSave /> Save Changes</>
              )}
            </button>
          </div>
        </motion.form>
      </div>

      {/* ── Image Cropping Modal ── */}
      <AnimatePresence>
        {isCropModalOpen && imageSrc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={cancelCrop} />
            
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200 dark:border-slate-800 flex flex-col">
              
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2"><FaCropAlt className="text-primary-500"/> Crop Avatar</h3>
                <button onClick={cancelCrop} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                  <FaTimes />
                </button>
              </div>

              <div className="relative w-full h-[300px] sm:h-[400px] bg-black">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1} // Square aspect ratio for avatar
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                    <span>Zoom</span>
                    <span>{Math.round(zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(e.target.value)}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button onClick={cancelCrop} className="flex-1 py-3 font-black rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleCropImage} disabled={isCropping} className="flex-1 py-3 font-black rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center gap-2">
                    {isCropping ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Apply Crop'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProfilePage;
