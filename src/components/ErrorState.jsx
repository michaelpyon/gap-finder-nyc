import { Link } from 'react-router-dom'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8">
      <div className="w-12 h-12 rounded-full border-2 border-red-500/30 flex items-center justify-center mb-4">
        <span className="text-red-400 text-lg">!</span>
      </div>
      <p className="text-sm text-red-400 text-center mb-4 max-w-sm">{message}</p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-xs font-medium bg-surface border border-border rounded-lg
              text-text hover:bg-border/50 transition-colors"
          >
            Retry
          </button>
        )}
        <Link
          to="/"
          className="px-4 py-2 text-xs font-medium bg-surface border border-border rounded-lg
            text-text hover:bg-border/50 transition-colors"
        >
          New Search
        </Link>
      </div>
    </div>
  )
}
