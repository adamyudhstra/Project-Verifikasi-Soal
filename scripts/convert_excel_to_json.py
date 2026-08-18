import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

try:
    import pandas as pd
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pandas", "openpyxl"])
    import pandas as pd

docs_dir = r"C:\Users\adamy\KULIAHHHHH\Project-Verifikasi-Soal\docs"
storage_dir = r"C:\Users\adamy\KULIAHHHHH\Project-Verifikasi-Soal\apps\api\storage\app"

if not os.path.exists(storage_dir):
    os.makedirs(storage_dir)

def dump_to_json(df, filename):
    out_path = os.path.join(storage_dir, filename)
    df.to_json(out_path, orient='records', force_ascii=False)
    print(f"Dumped {len(df)} records to {filename}")

# 1. Dosen
file_dosen = os.path.join(docs_dir, "List Nama Dosen Prodi & Dosen LB Prodi S1 Sistem Informasi TUKJ_2026.xlsx")
xl_dosen = pd.ExcelFile(file_dosen)

dosen_records = []
# parse Prodi
df_prodi = xl_dosen.parse('Dosen Prodi S1 SI TUKJ')
# rename columns for safety since there are "Unnamed"
df_prodi.columns = ['No', 'ID', 'Nama Lengkap', 'Kode Dosen', 'JFA', 'Kelompok', 'CoE', 'No_HP']
for _, row in df_prodi.iterrows():
    nama = str(row.get('Nama Lengkap', '')).strip()
    if nama and nama != 'Nama Lengkap' and nama != 'nan':
        dosen_records.append({
            'nama': nama,
            'kode_dosen': str(row.get('Kode Dosen', '')).strip() if pd.notna(row.get('Kode Dosen')) else None,
            'jfa': str(row.get('JFA', '')).strip() if pd.notna(row.get('JFA')) else None,
            'no_hp': str(row.get('No_HP', '')).strip() if pd.notna(row.get('No_HP')) else None,
            'source': 'Dosen Prodi S1 SI TUKJ'
        })

for sheet in ['Dosen LB_Ganjil 2425', 'Dosen LB_Genap 2425', 'Dosen LB_Ganjil 2526', 'Dosen LB_Genap 2526']:
    df_lb = xl_dosen.parse(sheet)
    df_lb.columns = ['No', 'ID', 'Nama Lengkap', 'Kode Dosen', 'JFA', 'No_HP'] + list(df_lb.columns[6:])
    for _, row in df_lb.iterrows():
        nama = str(row.get('Nama Lengkap', '')).strip()
        if nama and nama != 'Nama Lengkap' and nama != 'nan':
            dosen_records.append({
                'nama': nama,
                'kode_dosen': str(row.get('Kode Dosen', '')).strip() if pd.notna(row.get('Kode Dosen')) else None,
                'jfa': str(row.get('JFA', '')).strip() if pd.notna(row.get('JFA')) else None,
                'no_hp': str(row.get('No_HP', '')).strip() if pd.notna(row.get('No_HP')) else None,
                'source': sheet
            })

dump_to_json(pd.DataFrame(dosen_records), 'dosen.json')

# 2. Courses
file_courses = os.path.join(docs_dir, "Mata_Kuliah_Sistem_Informasi_Semester_1-8.xlsx")
df_courses = pd.read_excel(file_courses, sheet_name='Mata Kuliah')
dump_to_json(df_courses, 'courses.json')

# 3. PLO CLO
file_plo = os.path.join(docs_dir, "PLO_CLO_MK_Mapping.xlsx")
df_plo_clo = pd.read_excel(file_plo, sheet_name='PLO-CLO-MK')
dump_to_json(df_plo_clo, 'plo_clo.json')

df_mapping = pd.read_excel(file_plo, sheet_name='Mapping MK')
dump_to_json(df_mapping, 'mapping.json')

# 4. CPMK
file_cpmk = os.path.join(docs_dir, "CPMK_CLO_Sistem_Informasi.xlsx")
df_cpmk = pd.read_excel(file_cpmk, sheet_name='CPMK_CLO')
dump_to_json(df_cpmk, 'cpmk.json')

print("All JSON dumped successfully.")
