import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

try:
    import pandas as pd
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pandas", "openpyxl"])
    import pandas as pd

files = [
    r"C:\Users\adamy\KULIAHHHHH\Project-Verifikasi-Soal\docs\PLO_CLO_MK_Mapping.xlsx",
    r"C:\Users\adamy\KULIAHHHHH\Project-Verifikasi-Soal\docs\CPMK_CLO_Sistem_Informasi.xlsx",
    r"C:\Users\adamy\KULIAHHHHH\Project-Verifikasi-Soal\docs\List Nama Dosen Prodi & Dosen LB Prodi S1 Sistem Informasi TUKJ_2026.xlsx",
    r"C:\Users\adamy\KULIAHHHHH\Project-Verifikasi-Soal\docs\Mata_Kuliah_Sistem_Informasi_Semester_1-8.xlsx"
]

for file in files:
    print(f"\n{'='*80}\nFILE: {os.path.basename(file)}\n{'='*80}")
    try:
        xl = pd.ExcelFile(file)
        print(f"Sheets found: {xl.sheet_names}")
        for sheet in xl.sheet_names:
            print(f"\n--- SHEET: {sheet} ---")
            df = xl.parse(sheet)
            print(f"Row count: {len(df)}")
            print(f"Column count: {len(df.columns)}")
            print(f"Headers: {list(df.columns)}")
            
            # Count nulls
            null_counts = df.isnull().sum()
            print("Missing values per column:")
            print(null_counts.to_string())
            
            # Print unique values or sample
            print("\nDuplicate rows count:", df.duplicated().sum())
            print("\nSample Data (First 3 rows):")
            print(df.head(3).to_string())
    except Exception as e:
        print(f"Error reading file: {e}")
