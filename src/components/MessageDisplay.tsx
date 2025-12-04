/**
 * MessageDisplay component for showing different types of messages
 * 
 * @param type - Type of message: 'error', 'loading', 'success', or 'info'
 * @param message - The message text to display
 * @param className - Optional additional CSS classes
 * 
 * @example
 * <MessageDisplay type="error" message="Failed to load data" />
 * <MessageDisplay type="loading" message="Loading..." />
 * <MessageDisplay type="success" message="Saved successfully" />
 */
interface MessageDisplayProps {
  type: 'error' | 'loading' | 'success' | 'info';
  message: string;
  className?: string;
}

export default function MessageDisplay({ type, message, className = '' }: MessageDisplayProps) {
  const baseClassName = 'mb-4 md:mb-6 p-4 rounded-md text-sm';
  
  const typeClassNames = {
    error: 'bg-red-50 border border-red-200 text-red-700',
    loading: 'bg-gray-50 border border-gray-200 text-gray-600',
    success: 'bg-green-50 border border-green-200 text-green-700',
    info: 'bg-blue-50 border border-blue-200 text-blue-700',
  };

  const finalClassName = `${baseClassName} ${typeClassNames[type]} ${className}`.trim();

  return (
    <div className={finalClassName}>
      {message}
    </div>
  );
}
