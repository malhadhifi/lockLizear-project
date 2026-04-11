export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">⚠️</span>
      <h3 className="text-lg font-semibold text-red-600 mb-2">Something went wrong</h3>
      <p className="text-slate-500 text-sm mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          Retry
        </button>
      )}
    </div>
  );
}
