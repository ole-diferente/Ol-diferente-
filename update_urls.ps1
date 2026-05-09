$urlToLocal = @{
    "m.73.jpg" = "Imagenes_Notas_Olfativas/Limón.jpg"
    "m.75.jpg" = "Imagenes_Notas_Olfativas/Bergamota.jpg"
    "m.72.jpg" = "Imagenes_Notas_Olfativas/Mandarina.jpg"
    "m.76.jpg" = "Imagenes_Notas_Olfativas/Toronja.jpg"
    "m.71.jpg" = "Imagenes_Notas_Olfativas/Naranja.jpg"
    "m.16.jpg" = "Imagenes_Notas_Olfativas/Neroli.jpg"
    "m.102.jpg" = "Imagenes_Notas_Olfativas/Lima.jpg"
    "m.5.jpg" = "Imagenes_Notas_Olfativas/Rosa.jpg"
    "m.6.jpg" = "Imagenes_Notas_Olfativas/Jazmín.jpg"
    "m.32.jpg" = "Imagenes_Notas_Olfativas/Lavanda.jpg"
    "m.151.jpg" = "Imagenes_Notas_Olfativas/Lirio de los valles.jpg"
    "m.104.jpg" = "Imagenes_Notas_Olfativas/Fresia.jpg"
    "m.21.jpg" = "Imagenes_Notas_Olfativas/Iris Pallida.jpg"
    "m.14.jpg" = "Imagenes_Notas_Olfativas/Geranio.jpg"
    "m.226.jpg" = "Imagenes_Notas_Olfativas/Margarita.jpg"
    "m.171.jpg" = "Imagenes_Notas_Olfativas/Manzana.jpg"
    "m.172.jpg" = "Imagenes_Notas_Olfativas/Piña.jpg"
    "m.174.jpg" = "Imagenes_Notas_Olfativas/Ciruela.jpg"
    "m.191.jpg" = "Imagenes_Notas_Olfativas/Coco.jpg"
    "m.170.jpg" = "Imagenes_Notas_Olfativas/Melón.jpg"
    "m.173.jpg" = "Imagenes_Notas_Olfativas/Pera.jpg"
    "m.154.jpg" = "Imagenes_Notas_Olfativas/Pimienta.jpg"
    "m.147.jpg" = "Imagenes_Notas_Olfativas/Canela.jpg"
    "m.317.jpg" = "Imagenes_Notas_Olfativas/Azafrán.jpg"
    "m.34.jpg" = "Imagenes_Notas_Olfativas/Pachulí.jpg"
    "m.33.jpg" = "Imagenes_Notas_Olfativas/Sándalo.jpg"
    "m.35.jpg" = "Imagenes_Notas_Olfativas/Vetiver.jpg"
    "m.38.jpg" = "Imagenes_Notas_Olfativas/Cedro.jpg"
    "m.36.jpg" = "Imagenes_Notas_Olfativas/Ámbar.jpg"
    "m.4.jpg" = "Imagenes_Notas_Olfativas/Almizcle.jpg"
    "m.74.jpg" = "Imagenes_Notas_Olfativas/Vainilla.jpg"
    "m.184.jpg" = "Imagenes_Notas_Olfativas/Café.jpg"
    "m.96.jpg" = "Imagenes_Notas_Olfativas/Tabaco.jpg"
    "m.163.jpg" = "Imagenes_Notas_Olfativas/Cuero.jpg"
    "m.247.jpg" = "Imagenes_Notas_Olfativas/Agua de Mar.jpg"
    "m.251.jpg" = "Imagenes_Notas_Olfativas/cachemira.jpg"
    "m.45.jpg" = "Imagenes_Notas_Olfativas/Aldehídos.jpg"
    "m.142.jpg" = "Imagenes_Notas_Olfativas/elemí.jpg"
}

$files = Get-ChildItem -Path '.' -Filter '*.html'
$files += Get-ChildItem -Path '.' -Filter 'notes_db.js'

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Use regex evaluation to replace matches
    $evaluator = [System.Text.RegularExpressions.MatchEvaluator] {
        param($match)
        $p1 = $match.Groups[1].Value
        if ($urlToLocal.ContainsKey($p1)) {
            return $urlToLocal[$p1]
        } else {
            return "Imagenes_Notas_Olfativas/" + $p1
        }
    }
    
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, 'https://www\.fragrantica\.com/ndata/images/notes/(m\.\d+\.jpg)', $evaluator)
    
    [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host "Updated $($file.Name)"
}
