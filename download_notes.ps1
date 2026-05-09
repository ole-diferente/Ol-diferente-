$urls = @(
    "https://www.fragrantica.com/ndata/images/notes/m.73.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.75.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.72.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.76.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.71.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.16.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.102.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.5.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.6.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.32.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.151.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.104.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.21.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.14.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.226.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.171.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.172.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.174.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.191.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.170.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.173.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.154.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.147.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.317.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.34.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.33.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.35.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.38.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.36.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.4.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.74.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.184.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.96.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.163.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.247.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.251.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.45.jpg",
    "https://www.fragrantica.com/ndata/images/notes/m.142.jpg"
)

$urls = $urls | Select-Object -Unique

foreach ($url in $urls) {
    $filename = $url.Split('/')[-1]
    $outputPath = "notes_images\$filename"
    
    if (-not (Test-Path $outputPath)) {
        Write-Host "Downloading $filename..."
        curl.exe -s -o $outputPath $url -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -e "https://www.fragrantica.com"
        Start-Sleep -Milliseconds 200 # polite delay
    } else {
        Write-Host "Skipping $filename, already exists."
    }
}
Write-Host "Download complete."
