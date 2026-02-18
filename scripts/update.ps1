# Remove the dist directory if it exists
if (Test-Path -Path ./src/dist) {
    Remove-Item -Recurse -Force ./src/dist
}

# Remove the build directory if it exists
if (Test-Path -Path ./src/build) {
    Remove-Item -Recurse -Force ./src/build
}

# Build the distribution files with build and dist folders set to src
python ./src/setup.py --dist-dir=./src/dist --build-base=./src/build sdist bdist_wheel

# Find the latest .whl file in the dist directory
$latestWhl = Get-ChildItem -Path ./src/dist -Filter *.whl | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if ($null -eq $latestWhl) {
    Write-Host "No .whl file found in the src/dist directory. Exiting."
    exit 1
}

# Install the latest .whl file
pip install $latestWhl.FullName --force-reinstall

# Ask the user if they want to upload through twine
$upload = Read-Host "Do you want to upload through twine? (y/n)"
if ($upload -eq "y") {
    twine upload ./src/dist/*
}