$lines = Get-Content "c:\Users\Gonza\Desktop\WEB perfume\index.html" -Encoding UTF8

$htmlStructure = Get-Content "c:\Users\Gonza\Desktop\WEB perfume\html_structure.txt" -Encoding UTF8
$particlesCode = Get-Content "c:\Users\Gonza\Desktop\WEB perfume\particles.txt" -Encoding UTF8
$animationCode = Get-Content "c:\Users\Gonza\Desktop\WEB perfume\animation.txt" -Encoding UTF8

$scriptIdx = -1
for ($i=0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '<script type="module">') {
        $scriptIdx = $i
        break
    }
}

$content = $lines -join "`n"

# First, replace the HTML header/footer
$patternHtml = '(?s)<!DOCTYPE html>.*?</main>.*?</footer>'
$content = [regex]::Replace($content, $patternHtml, ($htmlStructure -join "`n"))

# Second, replace the particle logic
$patternParticles = '(?s)// 5\. Particle System \(Vaporization.*?\).*?// Update theme listener'
$content = [regex]::Replace($content, $patternParticles, ($particlesCode -join "`n"))

# Third, replace animation loop
$patternAnimation = '(?s)// Animate Particles.*?renderer\.render\(scene, camera\);'
$content = [regex]::Replace($content, $patternAnimation, ($animationCode -join "`n"))

$utf8NoBom = New-Object System.Text.UTF8Encoding $False
[System.IO.File]::WriteAllText("c:\Users\Gonza\Desktop\WEB perfume\index.html", $content, $utf8NoBom)
