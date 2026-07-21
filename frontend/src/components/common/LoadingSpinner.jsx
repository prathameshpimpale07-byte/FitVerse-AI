const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-6 h-6', md: 'w-12 h-12', lg: 'w-16 h-16' };
  return (
    <div className="flex items-center justify-center py-12">
      <div className={`${sizes[size]} border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin`} />
    </div>
  );
};

export default LoadingSpinner;
