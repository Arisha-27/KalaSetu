# similarity.py
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from services.preprocessing import transform_with_preprocessor
from services.config import MIN_CATEGORY_MATCHES, SIMILARITY_THRESHOLD

def find_similarity_for_input(input_row, preproc,
                              min_cat_matches=MIN_CATEGORY_MATCHES,
                              text_threshold=SIMILARITY_THRESHOLD):
    df_in = pd.DataFrame([input_row])
    X_in_full, _, X_in_svd = transform_with_preprocessor(df_in, preproc)

    train_cat_df = preproc['X_full_df'][preproc['cat_cols']].reset_index(drop=True)
    in_cat_values = X_in_full[preproc['cat_cols']].iloc[0]

    matches = (train_cat_df == in_cat_values.values).sum(axis=1)
    max_cat_matches = int(matches.max())

    train_svd = preproc['X_svd_array']
    sim_scores = cosine_similarity(X_in_svd, train_svd).flatten()
    max_text_sim = float(sim_scores.max()) if sim_scores.size else 0.0

    is_similar = (max_cat_matches >= min_cat_matches) or (max_text_sim >= text_threshold)
    return is_similar, {"max_cat_matches": max_cat_matches, "max_text_similarity": max_text_sim}
