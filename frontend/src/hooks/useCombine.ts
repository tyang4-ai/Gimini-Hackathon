import { useState, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { checkHint } from '@/lib/hints';
import { DEMO_MODE, getDemoCombine } from '@/lib/demoData';
import type { Element, CombineResponse } from '@/types';

// === RESULT INTERFACE ===

export interface CombineResult {
  element: Element;
  isMilestone: boolean;
  isIntermediate: boolean;
  isFirstDiscovery: boolean;
  hint?: string;
}

export interface UseCombineResult {
  combine: (elementAId: string, elementBId: string) => Promise<CombineResult | null>;
  isLoading: boolean;
  error: string | null;
}

// === HOOK IMPLEMENTATION ===

export function useCombine(): UseCombineResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get store actions and state
  const discoverElement = useGameStore((state) => state.discoverElement);
  const startReveal = useGameStore((state) => state.startReveal);
  const clearSlots = useGameStore((state) => state.clearSlots);
  const setHint = useGameStore((state) => state.setHint);
  const contextTokens = useGameStore((state) => state.contextTokens);
  const discoveredElements = useGameStore((state) => state.discoveredElements);

  const combine = useCallback(
    async (elementAId: string, elementBId: string): Promise<CombineResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // Check for demo mode first
        if (DEMO_MODE) {
          const cached = getDemoCombine(elementAId, elementBId);
          if (cached) {
            console.log('[DEMO] Using cached combine result for:', elementAId, '+', elementBId);

            const { element, isMilestone, isIntermediate, isFirstDiscovery, hint } = cached;

            // If milestone and first discovery, trigger reveal sequence
            if (isMilestone && isFirstDiscovery) {
              startReveal(element);
            }

            // Add new element to discovered elements
            discoverElement(element);

            // Clear the combine slots after successful combination
            clearSlots();

            // If there's a hint, show it
            if (hint) {
              setHint(hint);
            }

            setIsLoading(false);

            return {
              element,
              isMilestone,
              isIntermediate,
              isFirstDiscovery,
              hint,
            };
          }
          // If no cached data in demo mode, log and continue to API call
          console.log('[DEMO] No cached data for:', elementAId, '+', elementBId, '- falling back to API');
        }

        // Build set of discovered element IDs for hint checking
        const discoveredIds = new Set(discoveredElements.keys());

        // Check for hints first (local check before API call)
        const hintTrigger = checkHint(elementAId, elementBId, discoveredIds);
        if (hintTrigger) {
          // Show hint to player
          setHint(hintTrigger.hint);
          setIsLoading(false);
          return null;
        }

        // Call the combine API
        const response = await fetch('/api/combine', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            elementA: elementAId,
            elementB: elementBId,
            contextTokens,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data: CombineResponse = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Combination failed');
        }

        if (!data.result) {
          // No result but success - elements don't combine
          setIsLoading(false);
          return null;
        }

        const { element, isMilestone, isIntermediate, isFirstDiscovery, hint } = data.result;

        // If milestone and first discovery, trigger reveal sequence
        if (isMilestone && isFirstDiscovery) {
          startReveal(element);
        }

        // Add new element to discovered elements
        discoverElement(element);

        // Clear the combine slots after successful combination
        clearSlots();

        // If there's a hint from the API (different from local hints), show it
        if (hint) {
          setHint(hint);
        }

        setIsLoading(false);

        return {
          element,
          isMilestone,
          isIntermediate,
          isFirstDiscovery,
          hint,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        setIsLoading(false);
        return null;
      }
    },
    [discoveredElements, contextTokens, discoverElement, startReveal, clearSlots, setHint]
  );

  return {
    combine,
    isLoading,
    error,
  };
}

export default useCombine;
