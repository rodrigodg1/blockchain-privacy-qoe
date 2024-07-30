import pandas as pd

# Path to the Excel file
file_path = 'translated_dataset.xlsx'

# Read the Excel file
df = pd.read_excel(file_path)


print(df["VMOS"])