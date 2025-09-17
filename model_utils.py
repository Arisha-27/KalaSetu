import joblib
import numpy as np
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from config import RANDOM_STATE

def train_model(X_full_df, y_series, cat_cols=None):
    y_log = np.log1p(y_series.values)
    X_train, X_val, y_tr, y_val = train_test_split(
        X_full_df, y_log, test_size=0.2, random_state=RANDOM_STATE
    )

    model = lgb.LGBMRegressor(
        objective='regression',
        n_estimators=10000,
        learning_rate=0.05,
        num_leaves=31,
        random_state=RANDOM_STATE,
        n_jobs=-1,
        categorical_feature=cat_cols
    )

    model.fit(
        X_train,
        y_tr,
        eval_set=[(X_val, y_val)],
        callbacks=[
            lgb.early_stopping(stopping_rounds=100),
            lgb.log_evaluation(period=100)
        ]
    )

    y_pred_val_log = model.predict(X_val)
    y_pred_val = np.expm1(y_pred_val_log)
    y_val_orig = np.expm1(y_val)

    metrics = {
        'MAE': mean_absolute_error(y_val_orig, y_pred_val),
        'RMSE': mean_squared_error(y_val_orig, y_pred_val, squared=False),
        'R2': r2_score(y_val_orig, y_pred_val)
    }

    return model, metrics


# ------------------------------
# NEW FUNCTIONS
# ------------------------------
def save_model_and_preproc(model, preproc,
                           model_path="price_model.pkl",
                           preproc_path="preprocessor.pkl"):
    """Save trained model and preprocessing pipeline."""
    joblib.dump(model, model_path)
    joblib.dump(preproc, preproc_path)
    print(f"✅ Model saved at {model_path}")
    print(f"✅ Preprocessor saved at {preproc_path}")


def load_model_and_preproc(model_path="price_model.pkl",
                           preproc_path="preprocessor.pkl"):
    """Load model and preprocessing pipeline."""
    model = joblib.load(model_path)
    preproc = joblib.load(preproc_path)
    print("✅ Model and Preprocessor loaded successfully")
    return model, preproc
