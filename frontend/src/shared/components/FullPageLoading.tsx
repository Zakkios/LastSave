const FullPageLoading = () => {
  return (
    <div className="z-50 fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-emerald-400"></div>
    </div>
  );
};

export default FullPageLoading;
