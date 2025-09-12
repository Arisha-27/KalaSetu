# data_utils.py
import os
import pandas as pd
from services.config import DATA_PATH, REQUIRED_COLS


def load_dataset(path=DATA_PATH):
    # 1. Check if file exists
    if not os.path.exists(path):
        raise FileNotFoundError(f"Data file not found at: {path}")

    # 2. Load file depending on extension
    ext = os.path.splitext(path)[1].lower()
    if ext == ".csv":
        df = pd.read_csv(path)
    elif ext in [".xlsx", ".xls"]:
        df = pd.read_excel(path)
    else:
        raise ValueError(f"Unsupported file format: {ext}. Use .csv, .xlsx, or .xls")

    # 3. Validate required columns
    missing = [c for c in REQUIRED_COLS if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")

    # 4. Return only required columns, in the expected order
    return df[REQUIRED_COLS].copy()
