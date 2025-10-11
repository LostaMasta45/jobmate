# How to Reset Sidebar to Default

If the sidebar appears collapsed on desktop and you want to reset it to the default (open) state:

## Method 1: Via Browser Console
1. Open browser DevTools (F12 or Right-click → Inspect)
2. Go to Console tab
3. Type: `localStorage.removeItem('jobmate_sidebar_collapsed')`
4. Press Enter
5. Refresh the page (F5 or Ctrl+R)

## Method 2: Via Application/Storage Tab
1. Open browser DevTools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Find "Local Storage" in the left sidebar
4. Click on your domain (localhost:3000)
5. Find the key `jobmate_sidebar_collapsed`
6. Right-click and delete
7. Refresh the page

## Method 3: Clear All Site Data
1. Open browser DevTools (F12)
2. Go to Application tab
3. Click "Clear site data" button
4. Refresh the page

## Default Behavior
- **Desktop (≥ 1024px)**: Sidebar open by default (width: 256px)
- **Mobile (< 1024px)**: Sidebar hidden, accessible via hamburger menu
- State persists in localStorage
- Toggle button: "Hide Sidebar" when open, arrow icon when collapsed

## Features
✅ Smooth animations (300ms ease-in-out)
✅ Hover effects on navigation items
✅ Active state highlighting
✅ Tooltips when collapsed
✅ Responsive design
✅ localStorage persistence
