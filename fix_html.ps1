$dir = "c:\Users\Gonza\Desktop\WEB perfume"
$files = Get-ChildItem -Path $dir -Filter *.html | Where-Object { $_.Name -ne 'index.html' }

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw

    # 1. Remove style.css
    $content = $content -replace '<link rel="stylesheet" href="style\.css">\r?\n?', ''

    # 2. Add meta referrer if not present
    if ($content -notmatch '<meta name="referrer"') {
        $content = $content -replace '</title>', "</title>`n    <meta name=`"referrer`" content=`"no-referrer`">"
    }

    # 3. For product pages, add product_manager.js
    if ($file.Name -ne 'tienda.html' -and $content -notmatch 'product_manager\.js') {
        $content = $content -replace '<script src="cart\.js"></script>', "<script src=`"product_manager.js`"></script>`n    <script src=`"cart.js`"></script>"
    }

    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Fixed $($file.Name)"
}
