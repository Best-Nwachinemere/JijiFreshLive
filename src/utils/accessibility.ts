// Accessibility utilities and helpers

export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
    
    if (e.key === 'Escape') {
      element.dispatchEvent(new CustomEvent('escape'));
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
  firstElement?.focus();
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
};

export const getColorContrast = (foreground: string, background: string): number => {
  // Simplified contrast calculation
  const getLuminance = (color: string) => {
    const rgb = parseInt(color.replace('#', ''), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

export const checkAccessibility = () => {
  const issues: string[] = [];
  
  // Check for images without alt text
  const images = document.querySelectorAll('img:not([alt])');
  if (images.length > 0) {
    issues.push(`${images.length} images missing alt text`);
  }
  
  // Check for buttons without accessible names
  const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
  const buttonsWithoutText = Array.from(buttons).filter(btn => !btn.textContent?.trim());
  if (buttonsWithoutText.length > 0) {
    issues.push(`${buttonsWithoutText.length} buttons without accessible names`);
  }
  
  // Check for form inputs without labels
  const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  const inputsWithoutLabels = Array.from(inputs).filter(input => {
    const id = input.getAttribute('id');
    return !id || !document.querySelector(`label[for="${id}"]`);
  });
  if (inputsWithoutLabels.length > 0) {
    issues.push(`${inputsWithoutLabels.length} form inputs without labels`);
  }
  
  if (issues.length > 0) {
    console.warn('Accessibility issues found:', issues);
  }
  
  return issues;
};

// Keyboard navigation helpers
export const handleArrowNavigation = (
  e: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onIndexChange: (index: number) => void
) => {
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault();
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      onIndexChange(nextIndex);
      items[nextIndex]?.focus();
      break;
      
    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      onIndexChange(prevIndex);
      items[prevIndex]?.focus();
      break;
      
    case 'Home':
      e.preventDefault();
      onIndexChange(0);
      items[0]?.focus();
      break;
      
    case 'End':
      e.preventDefault();
      const lastIndex = items.length - 1;
      onIndexChange(lastIndex);
      items[lastIndex]?.focus();
      break;
  }
};