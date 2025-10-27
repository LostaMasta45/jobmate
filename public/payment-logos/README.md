# Payment Method Logos

This folder contains payment method logos for display on payment page.

## Files Required:

Place these logo files (PNG format) in this directory:

1. **qris.png** - QRIS (Quick Response Code Indonesian Standard)
2. **dana.png** - DANA E-Wallet
3. **ovo.png** - OVO E-Wallet  
4. **gopay.png** - GoPay
5. **bca.png** - Bank Central Asia
6. **mandiri.png** - Bank Mandiri
7. **bni.png** - Bank Negara Indonesia
8. **bri.png** - Bank Rakyat Indonesia

## Recommended Specifications:

- **Format:** PNG with transparent background
- **Size:** 200x200px to 400x400px (square)
- **File size:** < 50KB per logo for optimal loading
- **Quality:** High resolution for clarity on all devices

## Usage in Code:

```jsx
<Image 
  src="/payment-logos/qris.png" 
  alt="QRIS" 
  width={80} 
  height={80} 
/>
```

## Sources:

Logos can be obtained from:
- Official brand websites
- SeekLogo.com
- LogoSear.ch
- Official brand press kits

## License:

All logos are trademarks of their respective owners. 
Used for identification purposes only under fair use.

## Notes:

- All logos display at uniform 80x80px size in the UI
- Images are optimized by Next.js Image component
- Fallback to emoji (💳) if image fails to load
