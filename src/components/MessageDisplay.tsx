interface MessageDisplayProps {
  type: 'error' | 'loading' | 'success' | 'info';
  message: string;
  className?: string;
}

export default function MessageDisplay({ type, message, className = '' }: MessageDisplayProps) {
  const baseClassName = 'mb-4 md:mb-6 p-4 rounded-md text-sm';
  
  const typeClassNames = {
    error: 'bg-red-50 border border-red-200 text-red-700',
    loading: 'text-gray-600',
    success: 'bg-green-50 border border-green-200 text-green-700',
    info: 'bg-blue-50 border border-blue-200 text-blue-700',
  };

  const finalClassName = type === 'loading' 
    ? `text-gray-600 ${className}`.trim()
    : `${baseClassName} ${typeClassNames[type]} ${className}`.trim();

  return (
    <div className={finalClassName}>
      {message}
    </div>
  );
}
