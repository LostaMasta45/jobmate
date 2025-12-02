# Email Generator Improvements Plan

## 1. Data Persistence (Auto-save) - ✅ DONE
- **Problem**: Currently, if the user refreshes the page, all entered data is lost.
- **Solution**: Implement `useEffect` to save `formData` to `localStorage` and restore it on mount.

## 2. Enhanced Validation - ✅ DONE
- **Problem**: Users only know they can't proceed because the "Next" button is disabled, but they don't know *why*.
- **Solution**:
    - Add visual indicators (red border or helper text) for required fields in `StepBasicInfo` and others.
    - Show a toast or shake animation if trying to click "Next" with invalid data.

## 3. AI Generation UX - ✅ DONE
- **Problem**: The generation process just shows a spinner on the button.
- **Solution**:
    - Show a "Writing..." overlay or skeleton in the Preview area while generating.
    - Add a "Regenerate" button in the final step if the result isn't satisfactory. (Existing language buttons serve this purpose)

## 4. Preview Improvements - ✅ DONE
- **Problem**: The preview is static text.
- **Solution**:
    - Make the preview more like a real email client (Gmail/Outlook style).
    - Add "Copy Subject" and "Copy Body" buttons separately.

## 5. Code Quality - ✅ DONE
- **Refactor**: Extract the `LivePreview` into its own component file `LivePreview.tsx` to reduce `EmailWizard.tsx` size.
