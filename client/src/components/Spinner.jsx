function Spinner() {
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-600"></div>
    </div>
  );
}

export default Spinner;
