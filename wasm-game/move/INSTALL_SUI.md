# Εγκατάσταση Sui CLI στο Windows

## Επιλογή 1: Με PowerShell ως Administrator (Συνιστάται)

1. Ανοίξτε PowerShell **ως Administrator** (Right-click → Run as Administrator)

2. Εκτελέστε:
```powershell
choco install sui -y
```

3. Κλείστε και ανοίξτε ξανά το PowerShell για να ανανεωθεί το PATH

4. Επαληθεύστε:
```powershell
sui --version
```

## Επιλογή 2: Manual Installation από GitHub

1. Πηγαίνετε στο: https://github.com/MystenLabs/sui/releases

2. Κατεβάστε το `sui-{version}-x86_64-pc-windows-msvc.zip` (για Windows)

3. Εξαγάγετε το ZIP σε ένα φάκελο, π.χ. `C:\Program Files\Sui\`

4. Προσθέστε το φάκελο `bin` στο PATH:
   - Ανοίξτε "Environment Variables" από το Control Panel
   - Προσθέστε `C:\Program Files\Sui\bin` στο System PATH
   - Ή εκτελέστε στο PowerShell (ως Administrator):
   ```powershell
   [System.Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\Sui\bin", [System.EnvironmentVariableTarget]::Machine)
   ```

5. Κλείστε και ανοίξτε ξανά το PowerShell

6. Επαληθεύστε:
```powershell
sui --version
```

## Επιλογή 3: Με Cargo (αν έχετε Rust)

```powershell
cargo install --git https://github.com/MystenLabs/sui.git --branch main --bin sui sui
```

**Σημείωση:** Αυτό μπορεί να πάρει αρκετό χρόνο γιατί θα compile από source.

## Μετά την εγκατάσταση

Μόλις εγκαταστήσετε το Sui CLI, μπορείτε να build τα Move contracts:

```powershell
cd wasm-game/move
sui move build
```

