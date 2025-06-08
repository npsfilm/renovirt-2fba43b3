
import React from 'react';

interface ValidationMessageProps {
  validationState: 'idle' | 'valid' | 'invalid' | 'error';
  errorMessage: string;
  retryCount: number;
  onRetry: () => void;
}

const ValidationMessage = ({ validationState, errorMessage, retryCount, onRetry }: ValidationMessageProps) => {
  if (validationState === 'valid') {
    return (
      <p className="text-sm text-green-400">
        ✓ Gültiger Empfehlungscode - Sie erhalten 10 kostenlose Bilder!
      </p>
    );
  }

  if (errorMessage) {
    return (
      <div className="space-y-2">
        <p className={`text-sm ${
          validationState === 'error' ? 'text-yellow-400' : 'text-red-400'
        }`}>
          {errorMessage}
        </p>
        {validationState === 'error' && retryCount < 3 && (
          <button
            onClick={onRetry}
            className="text-sm text-blue-400 hover:text-blue-300 underline"
          >
            Erneut versuchen
          </button>
        )}
      </div>
    );
  }

  return null;
};

export default ValidationMessage;
