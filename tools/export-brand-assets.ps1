# Export the existing artwork without changing its composition or character.
Add-Type -AssemblyName System.Drawing
$siteDirectory = Join-Path $PSScriptRoot '../site'
$sourcePath = Join-Path $siteDirectory 'logo.png'
$sourceImage = [System.Drawing.Image]::FromFile($sourcePath)
try {
    foreach ($asset in @(
        @{ Name = 'favicon.png'; Size = 96 },
        @{ Name = 'apple-touch-icon.png'; Size = 180 }
    )) {
        $bitmap = [System.Drawing.Bitmap]::new($asset.Size, $asset.Size)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        try {
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.DrawImage($sourceImage, 0, 0, $asset.Size, $asset.Size)
            $bitmap.Save((Join-Path $siteDirectory $asset.Name), [System.Drawing.Imaging.ImageFormat]::Png)
        } finally {
            $graphics.Dispose()
            $bitmap.Dispose()
        }
    }
} finally {
    $sourceImage.Dispose()
}
Copy-Item -LiteralPath $sourcePath -Destination (Join-Path $siteDirectory 'og.png') -Force
