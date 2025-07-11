
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { Button as ButtonType } from '../../server/src/schema';

function App() {
  const [buttonData, setButtonData] = useState<ButtonType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useCallback to memoize function used in useEffect
  const loadButton = useCallback(async () => {
    try {
      const result = await trpc.getButton.query({ id: 1 });
      setButtonData(result);
    } catch (error) {
      console.error('Failed to load button:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect with proper dependencies
  useEffect(() => {
    loadButton();
  }, [loadButton]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {buttonData && (
          <Button
            className="w-32 h-16 text-lg font-medium"
            style={{ backgroundColor: buttonData.color }}
            // No onClick handler as specified - no associated actions
          >
            {buttonData.text || ''} {/* Display text if any, otherwise empty */}
          </Button>
        )}
      </div>
    </div>
  );
}

export default App;
