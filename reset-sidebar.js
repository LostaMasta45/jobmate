/**
 * Reset Sidebar State Utility
 * 
 * This script resets the sidebar to its default state (open).
 * Run this in the browser console if you need to reset the sidebar.
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Paste this entire script
 * 3. Press Enter
 * 4. Refresh the page
 */

(function resetSidebar() {
  try {
    // Remove sidebar collapsed state
    localStorage.removeItem('jobmate_sidebar_collapsed');
    
    console.log('✅ Sidebar state has been reset!');
    console.log('📝 The sidebar will now open by default on your next page load.');
    console.log('🔄 Please refresh the page (F5 or Ctrl+R) to see the changes.');
    
    // Optional: Auto-refresh after confirmation
    const autoRefresh = confirm('Sidebar state reset! Click OK to refresh the page now.');
    if (autoRefresh) {
      window.location.reload();
    }
  } catch (error) {
    console.error('❌ Error resetting sidebar:', error);
    console.log('💡 Try manually: localStorage.removeItem("jobmate_sidebar_collapsed")');
  }
})();
