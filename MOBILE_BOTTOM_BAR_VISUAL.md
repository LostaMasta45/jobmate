# 📱 MOBILE BOTTOM BAR - Visual Design Spec

## 🎨 Final Design (CORRECTED)

### Layout Structure

```
┌────────────────────────────────────────────────┐
│ 🔔  JobMate                        🌙  👤     │ ← HEADER (Sticky)
│                                                │   - Notification Bell (with badge)
│                                                │   - Theme Toggle (Moon/Sun)
│                                                │   - User Avatar
├────────────────────────────────────────────────┤
│                                                │
│                                                │
│          MAIN CONTENT AREA                     │
│          (Scrollable)                          │
│                                                │
│                                                │
│                                                │
│                                                │
│                                                │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│    🏠        💼         🔧         ⚙️      👤 │ ← BOTTOM BAR (Fixed)
│   Home      Jobs      TOOLS    Settings    Me │
│                    ┌────────┐                  │
│                    │ Center │                  │
│                    │Elevated│                  │
│                    └────────┘                  │
└────────────────────────────────────────────────┘
```

---

## 🎯 Bottom Bar Specifications

### 1. **Position & Size**

```css
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px; /* Mobile */
  height: 72px; /* Tablet */
  z-index: 50;
}
```

### 2. **Items Layout**

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  [Home]    [Jobs]    [CENTER]    [Settings] [Me]│
│    16%       16%    <- 20% ->      16%      16% │
│                      (Elevated)                  │
└──────────────────────────────────────────────────┘

Total: 84% (4 regular items) + 20% spacing for center
```

### 3. **Center Button (Tools) - SPECIAL** 🌟

```
Visual:
        ┌──────────┐
        │  ╱━━━╲   │ ← Elevated above bar
        │ │ 🔧 │   │ ← Icon centered
        │  ╲━━━╱   │ ← Rounded corners
        └──────────┘

Specs:
- Width: 64px
- Height: 64px
- Border Radius: 16px
- Elevation: -24px (above bar)
- Background: Gradient Purple
- Shadow: 0 10px 25px rgba(139, 92, 246, 0.3)
- Animation: scale on hover/active
```

---

## 🎨 Visual Mockup

### Mobile (375px)

```
╔══════════════════════════════════════╗
║ 🔔 JobMate              🌙 👤       ║ ← Header (h-16)
╠══════════════════════════════════════╣
║                                      ║
║  👋 Hai, John!                      ║
║                                      ║
║  ┌────────────────────────────────┐ ║
║  │ 👤 John Doe      💎 VIP       │ ║
║  │ 📧 john@email.com             │ ║
║  └────────────────────────────────┘ ║
║                                      ║
║  Tools JobMate                  →   ║
║  ┌─────────┬─────────┐             ║
║  │   📄    │   ✍️    │             ║
║  │ CV ATS  │  Surat  │             ║
║  ├─────────┼─────────┤             ║
║  │   💼    │   📊    │             ║
║  │Interview│  Loker  │             ║
║  └─────────┴─────────┘             ║
║                                      ║
║  (Content continues...)              ║
║                                      ║
╠══════════════════════════════════════╣
║          ┌──────────┐                ║ ← Tools button elevated
║  🏠      │   🔧    │      ⚙️    👤  ║ ← Bottom Bar (h-16)
║ Home  💼 │  TOOLS  │  Settings  Me  ║
║      Jobs└──────────┘                ║
╚══════════════════════════════════════╝
```

---

## 💻 Component Code

### BottomBar.tsx (Complete)

```typescript
"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Briefcase, Wrench, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { 
    icon: Home, 
    label: "Home", 
    href: "/dashboard", 
    color: "blue" 
  },
  { 
    icon: Briefcase, 
    label: "Jobs", 
    href: "/loker", 
    color: "orange" 
  },
  { 
    icon: Wrench, 
    label: "Tools", 
    href: "/tools", 
    color: "purple",
    isCenter: true
  },
  { 
    icon: Settings, 
    label: "Settings", 
    href: "/settings", 
    color: "gray" 
  },
  { 
    icon: User, 
    label: "Me", 
    href: "/profile", 
    color: "green" 
  }
]

export function BottomBar() {
  const pathname = usePathname()
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 lg:hidden">
      <div className="relative flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          
          // CENTER BUTTON - Special Design
          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  // Positioning
                  "absolute left-1/2 -translate-x-1/2 -top-6",
                  
                  // Layout
                  "flex items-center justify-center",
                  "w-16 h-16 rounded-2xl",
                  
                  // Background
                  "bg-gradient-to-br from-purple-500 to-purple-600",
                  "hover:from-purple-600 hover:to-purple-700",
                  
                  // Shadow
                  "shadow-xl shadow-purple-500/30",
                  
                  // Animation
                  "transform transition-all duration-200",
                  "hover:scale-110 active:scale-95",
                  
                  // Active state
                  isActive && "ring-4 ring-purple-200 dark:ring-purple-800"
                )}
              >
                <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
              </Link>
            )
          }
          
          // REGULAR BUTTONS
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors duration-200"
            >
              <Icon 
                className={cn(
                  "w-6 h-6 transition-transform",
                  isActive 
                    ? `text-${item.color}-600 dark:text-${item.color}-400 scale-110` 
                    : "text-gray-500 dark:text-gray-400"
                )} 
              />
              <span className={cn(
                "text-xs font-medium",
                isActive 
                  ? `text-${item.color}-600 dark:text-${item.color}-400` 
                  : "text-gray-500 dark:text-gray-400"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

---

### MobileHeader.tsx (Complete)

```typescript
"use client"

import Link from "next/link"
import { Bell, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface MobileHeaderProps {
  user?: {
    name?: string
    avatar?: string
  }
  notificationCount?: number
}

export function MobileHeader({ user, notificationCount = 0 }: MobileHeaderProps) {
  const { theme, setTheme } = useTheme()
  
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 lg:hidden">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left: Logo/Brand */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">JM</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            JobMate
          </h1>
        </Link>
        
        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Notification Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            asChild
          >
            <Link href="/notifications">
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Badge>
              )}
            </Link>
          </Button>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
          
          {/* User Avatar */}
          <Link href="/profile">
            <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-transparent hover:ring-blue-500 transition-all">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  )
}
```

---

### MobileLayout.tsx (Wrapper)

```typescript
"use client"

import { MobileHeader } from "./MobileHeader"
import { BottomBar } from "./BottomBar"
import { useMediaQuery } from "@/hooks/use-media-query"

export function MobileLayout({ 
  children, 
  user,
  notificationCount = 0 
}) {
  const isMobile = useMediaQuery("(max-width: 1023px)")
  
  if (!isMobile) {
    // Desktop layout (with sidebar)
    return children
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header - Sticky Top */}
      <MobileHeader 
        user={user} 
        notificationCount={notificationCount} 
      />
      
      {/* Main Content - Scrollable */}
      <main className="pb-20"> {/* pb-20 = space for bottom bar */}
        {children}
      </main>
      
      {/* Bottom Bar - Fixed Bottom */}
      <BottomBar />
    </div>
  )
}
```

---

## 🎨 Color Schemes

### Navigation Colors

```typescript
const navColors = {
  home: {
    active: "text-blue-600 dark:text-blue-400",
    inactive: "text-gray-500 dark:text-gray-400"
  },
  jobs: {
    active: "text-orange-600 dark:text-orange-400",
    inactive: "text-gray-500 dark:text-gray-400"
  },
  tools: {
    gradient: "from-purple-500 to-purple-600",
    shadow: "shadow-purple-500/30",
    ring: "ring-purple-200 dark:ring-purple-800"
  },
  settings: {
    active: "text-gray-700 dark:text-gray-300",
    inactive: "text-gray-500 dark:text-gray-400"
  },
  profile: {
    active: "text-green-600 dark:text-green-400",
    inactive: "text-gray-500 dark:text-gray-400"
  }
}
```

---

## ⚡ Animations

### 1. Center Button (Tools)

```css
/* Scale on hover */
.center-button:hover {
  transform: translateX(-50%) scale(1.1);
}

/* Press effect */
.center-button:active {
  transform: translateX(-50%) scale(0.95);
}

/* Active state ring pulse */
@keyframes ring-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.center-button.active::after {
  animation: ring-pulse 2s infinite;
}
```

### 2. Regular Items

```css
/* Icon bounce on active */
@keyframes bounce-subtle {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.nav-item.active .icon {
  animation: bounce-subtle 0.3s ease-in-out;
}
```

---

## 📐 Spacing & Safe Areas

### iOS Safe Area

```css
.bottom-bar {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Adjust height for devices with notch */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .bottom-bar {
    height: calc(64px + env(safe-area-inset-bottom));
  }
}
```

### Content Bottom Padding

```typescript
// Add space for bottom bar in scrollable content
<main className="pb-20"> {/* 80px = 64px bar + 16px extra */}
  {children}
</main>
```

---

## 🎯 Interactive States

### State Matrix

| State | Home | Jobs | Tools (Center) | Settings | Profile |
|-------|------|------|----------------|----------|---------|
| **Default** | Gray | Gray | Purple Gradient | Gray | Gray |
| **Hover** | Blue tint | Orange tint | Scale 1.1 | Gray dark | Green tint |
| **Active** | Blue | Orange | Purple + Ring | Gray dark | Green |
| **Pressed** | Blue dark | Orange dark | Scale 0.95 | Gray darker | Green dark |

---

## 📱 Device Testing

### Test Matrix

```
✅ iPhone SE (375px)
✅ iPhone 14 Pro (393px) - Dynamic Island
✅ iPhone 14 Pro Max (430px)
✅ Samsung Galaxy S21 (360px)
✅ Samsung Galaxy S21+ (384px)
✅ iPad Mini (768px)
✅ iPad Air (820px)
```

---

## ✨ Pro Tips

### 1. **Haptic Feedback**
```typescript
const triggerHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10) // 10ms
  }
}

// On button press
<Link onClick={triggerHaptic} />
```

### 2. **Prevent Scroll Behind Bottom Bar**
```css
body {
  padding-bottom: env(safe-area-inset-bottom);
}

.main-content {
  min-height: calc(100vh - 64px - 64px); /* viewport - header - bottom bar */
}
```

### 3. **Smooth Scroll**
```css
html {
  scroll-behavior: smooth;
}
```

---

## 🎉 Final Result

```
┌─────────────────────────────────────┐
│ 🔔 JobMate           🌙 👤  (3)    │ ← Sticky Header
├─────────────────────────────────────┤
│                                     │
│  [Scrollable Content]               │
│                                     │
├─────────────────────────────────────┤
│           ┌─────────┐               │
│  🏠   💼  │   🔧   │  ⚙️   👤      │ ← Fixed Bottom
│ Home Jobs │ TOOLS  │ Set   Me      │
│           └─────────┘               │
└─────────────────────────────────────┘

Features:
✅ Header tetap ada (notif, theme, avatar)
✅ Bottom bar dengan 5 item
✅ Tools di tengah, elevated, gradient purple
✅ Active state per item
✅ Smooth animations
✅ Safe area support (iOS notch)
```

---

**Ready to implement? Tools button will look AMAZING! 🚀✨**
