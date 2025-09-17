# predictor.py
import pandas as pd
import numpy as np
from services.preprocessing import transform_with_preprocessor
from services.similarity import find_similarity_for_input

def predict_with_similarity_check(model, input_row, preproc,
                                  min_cat_matches=3, text_threshold=0.6):
    similar, info = find_similarity_for_input(input_row, preproc,
                                              min_cat_matches, text_threshold)
    if not similar:
        raise ValueError("No similar product found in training dataset. Prediction aborted.")

    df_in = pd.DataFrame([input_row])
    X_in_full, _, _ = transform_with_preprocessor(df_in, preproc)
    pred_log = model.predict(X_in_full)
    return np.expm1(pred_log)[0], info
