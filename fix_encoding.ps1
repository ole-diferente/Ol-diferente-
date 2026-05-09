$dir = "c:\Users\Gonza\Desktop\WEB perfume"
$files = Get-ChildItem -Path $dir -Filter *.html | Where-Object { $_.Name -ne 'index.html' }

foreach ($file in $files) {
    # Read the file as UTF-8 so we get the literal corrupted strings
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8

    $content = $content -replace 'Ã¡', 'á'
    $content = $content -replace 'Ã©', 'é'
    $content = $content -replace 'Ã­', 'í'
    $content = $content -replace 'Ã³', 'ó'
    $content = $content -replace 'Ãº', 'ú'
    $content = $content -replace 'Ã±', 'ñ'
    $content = $content -replace 'Ã ', 'Á'
    $content = $content -replace 'Ã‰', 'É'
    $content = $content -replace 'Ã“', 'Ó'
    $content = $content -replace 'Ãš', 'Ú'
    $content = $content -replace 'Ã‘', 'Ñ'
    $content = $content -replace 'PachulÃ\s', 'Pachulí'
    $content = $content -replace 'PachulÃ', 'Pachulí'

    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Fixed encoding for $($file.Name)"
}
