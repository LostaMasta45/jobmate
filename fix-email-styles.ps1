# Fix inline styles in UpgradeVIPEmail.tsx
$file = "emails\UpgradeVIPEmail.tsx"
$content = Get-Content $file -Raw

# Replace all problematic inline style patterns
$replacements = @(
    # Fix semicolons to commas and add quotes to values
    @{ Pattern = 'style=\{\{ ([^}]+); ([^}]+); \}\}'; Replacement = 'style={{ $1, $2 }}' }
    @{ Pattern = 'style=\{\{ ([^}]+); \}\}'; Replacement = 'style={{ $1 }}' }
    
    # Fix specific CSS properties
    @{ Pattern = 'font-size: (\d+)px'; Replacement = 'fontSize: ''$1px''' }
    @{ Pattern = 'text-shadow: ([^;]+);'; Replacement = 'textShadow: ''$1'','}
    @{ Pattern = 'text-align: ([^;]+);'; Replacement = 'textAlign: ''$1'','}
    @{ Pattern = 'font-weight: (\d+);'; Replacement = 'fontWeight: $1,'}
    @{ Pattern = 'margin-bottom: ([^;]+);'; Replacement = 'marginBottom: ''$1'','}
    @{ Pattern = 'margin-top: ([^;]+);'; Replacement = 'marginTop: ''$1'','}
    @{ Pattern = 'line-height: ([^;]+);'; Replacement = 'lineHeight: $1,'}
    @{ Pattern = 'border-radius: ([^;]+);'; Replacement = 'borderRadius: ''$1'','}
    @{ Pattern = 'text-decoration: ([^;]+);'; Replacement = 'textDecoration: ''$1'','}
    @{ Pattern = 'background: ([^;]+);'; Replacement = 'background: ''$1'','}
    @{ Pattern = 'color: (#[0-9a-fA-F]+);'; Replacement = 'color: ''$1'','}
    @{ Pattern = 'margin: ([^;]+);'; Replacement = 'margin: ''$1'','}
    @{ Pattern = 'padding: ([^;]+);'; Replacement = 'padding: ''$1'','}
    @{ Pattern = 'display: ([^;]+);'; Replacement = 'display: ''$1'','}
    
    # Remove trailing commas before }}
    @{ Pattern = ',\s*\}\}'; Replacement = ' }}' }
)

foreach ($r in $replacements) {
    $content = $content -replace $r.Pattern, $r.Replacement
}

$content | Set-Content $file -NoNewline
Write-Host "Fixed $file"
