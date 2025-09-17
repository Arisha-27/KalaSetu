# preprocessing.py
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from config import TFIDF_MAX_FEATURES, TFIDF_NGRAM, SVD_COMPONENTS, CARDINALITY_MIN_FREQ, RANDOM_STATE

def fit_preprocessor(df):   ##  learns mappings + TF-IDF + SVD from training data.
    df = df.copy()
    df['description'] = df['description'].fillna('').astype(str)
    cat_cols = ['product_type', 'material', 'color', 'style', 'region']

    # rare category reduction
    cat_maps = {}
    for c in cat_cols:
        vc = df[c].fillna('unknown').astype(str).value_counts()
        allowed = vc[vc >= CARDINALITY_MIN_FREQ].index.tolist()
        if '__other__' not in allowed:
            allowed.append('__other__')
        df[c] = df[c].apply(lambda x: x if x in allowed else '__other__')
        df[c] = df[c].astype('category')
        cat_maps[c] = allowed

    # TF-IDF + SVD
    tfidf = TfidfVectorizer(max_features=TFIDF_MAX_FEATURES, ngram_range=TFIDF_NGRAM)
    X_tfidf = tfidf.fit_transform(df['description'])
    n_svd = min(SVD_COMPONENTS, X_tfidf.shape[1], max(1, df.shape[0]-1))
    svd = TruncatedSVD(n_components=n_svd, random_state=RANDOM_STATE)
    X_svd = svd.fit_transform(X_tfidf)

    svd_cols = [f"svd_{i}" for i in range(X_svd.shape[1])]
    df_svd = pd.DataFrame(X_svd, columns=svd_cols, index=df.index)
    X_full = pd.concat([df[cat_cols], df_svd], axis=1)

    return {
        'tfidf': tfidf,
        'svd': svd,
        'cat_cols': cat_cols,
        'cat_maps': cat_maps,
        'X_tfidf_matrix': X_tfidf,
        'X_svd_array': X_svd,
        'X_full_df': X_full
    }

def transform_with_preprocessor(df, preproc):   ## applies same transformations to test or new data
    df = df.copy()
    df['description'] = df['description'].fillna('').astype(str)
    cat_cols = preproc['cat_cols']

    for c in cat_cols:
        df[c] = df[c].fillna('unknown').astype(str)
        allowed = preproc['cat_maps'][c]
        df[c] = df[c].apply(lambda x: x if x in allowed else '__other__')
        df[c] = pd.Categorical(df[c], categories=allowed)

    X_tfidf = preproc['tfidf'].transform(df['description'])
    X_svd = preproc['svd'].transform(X_tfidf)
    svd_cols = [f"svd_{i}" for i in range(X_svd.shape[1])]
    df_svd = pd.DataFrame(X_svd, columns=svd_cols, index=df.index)

    X_full = pd.concat([df[cat_cols], df_svd], axis=1)
    return X_full, X_tfidf, X_svd


