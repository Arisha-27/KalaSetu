import os

# Automatically detect data file
# It will first check CSV, then Excel
if os.path.exists("data.csv"):
    DATA_PATH = "data.csv"
elif os.path.exists("data.xlsx"):
    DATA_PATH = "data.xlsx"
elif os.path.exists("data.xls"):
    DATA_PATH = "data.xls"
else:
    DATA_PATH = None   # Will cause error in data_utils if not found

# Required columns
REQUIRED_COLS = [
    'product_type', 'material', 'color', 'style',
    'region', 'description', 'price'
]

# TF-IDF settings
TFIDF_MAX_FEATURES = 5000
TFIDF_NGRAM = (1, 2)
SVD_COMPONENTS = 50

# Category handling
CARDINALITY_MIN_FREQ = 2

# Similarity thresholds
SIMILARITY_THRESHOLD = 0.60
MIN_CATEGORY_MATCHES = 3

# Random seed
RANDOM_STATE = 42
