# # main.py
# from data_utils import load_dataset
# from preprocessing import fit_preprocessor
# from model_utils import train_model
# from predictor import predict_with_similarity_check
# from config import DATA_PATH

# def run_pipeline():
#     df = load_dataset(DATA_PATH)
#     preproc = fit_preprocessor(df)
#     X_full = preproc['X_full_df']
#     y = df['price'].astype(float)
#     model, metrics = train_model(X_full, y, preproc['cat_cols'])
#     print("Validation metrics:", metrics)
#     return model, preproc

# if __name__ == "__main__":
#     model, preproc = run_pipeline()

#     # Example test input
#     input_product = {
#         "product_type": "shawl",
#         "material": "wool",
#         "color": "dark brown",
#         "style": "pashmina",
#         "region": "kashmir",
#         "description": "Traditional Kashmir pashmina shawl with intricate detailing."
#     }

#     try:
#         price, info = predict_with_similarity_check(model, input_product, preproc)
#         print("Predicted Price (INR):", round(price, 2))
#         print("Similarity Info:", info)
#     except ValueError as e:
#         print("ERROR:", e)




# # main.py
# from data_utils import load_dataset
# from preprocessing import fit_preprocessor
# from model_utils import train_model
# from predictor import predict_with_similarity_check
# from config import DATA_PATH

# def run_pipeline():
#     # Load dataset
#     df = load_dataset(DATA_PATH)

#     # Ensure 'price' column exists
#     if 'price' not in df.columns:
#         raise ValueError("Dataset is missing required column: 'price'")

#     # Preprocessing
#     preproc = fit_preprocessor(df)
#     X_full = preproc['X_full_df']
#     y = df['price'].astype(float)

#     # Safely get categorical columns
#     cat_cols = preproc.get('cat_cols', None)
#     print("Categorical columns:", cat_cols)

#     # Train model
#     model, metrics = train_model(X_full, y, cat_cols)
#     print("Validation metrics:", metrics)

#     return model, preproc


# if __name__ == "__main__":
#     # Run the full pipeline
#     model, preproc = run_pipeline()

#     # Example test input
#     input_product = {
#         "product_type": "shawl",
#         "material": "wool",
#         "color": "dark brown",
#         "style": "pashmina",
#         "region": "kashmir",
#         "description": "Traditional Kashmir pashmina shawl with intricate detailing."
#     }

#     # Predict price
#     try:
#         price, info = predict_with_similarity_check(model, input_product, preproc)
#         print("Predicted Price (INR):", round(price, 2))
#         print("Similarity Info:", info)
#     except ValueError as e:
#         print("ERROR:", e)




# main.py
from data_utils import load_dataset
from preprocessing import fit_preprocessor
from model_utils import train_model
from predictor import predict_with_similarity_check
from model_utils import train_model, save_model_and_preproc
from config import DATA_PATH

def run_pipeline():
    # Load dataset
    df = load_dataset(DATA_PATH)

    # Ensure 'price' column exists
    if 'price' not in df.columns:
        raise ValueError("Dataset is missing required column: 'price'")

    # Preprocessing
    preproc = fit_preprocessor(df)
    X_full = preproc['X_full_df']
    y = df['price'].astype(float)

    # Safely get categorical columns
    cat_cols = preproc.get('cat_cols', None)
    print("Categorical columns:", cat_cols)

    # Train model
    model, metrics = train_model(X_full, y, cat_cols)
    print("Validation metrics:", metrics)
    
    save_model_and_preproc(model, preproc)

    return model, preproc


if __name__ == "__main__":
    # Run the full pipeline
    model, preproc = run_pipeline()

    # Example test input
    input_product = {
        "product_type": "shawl",
        "material": "wool",
        "color": "dark brown",
        "style": "pashmina",
        "region": "kashmir",
        "description": "Traditional Kashmir pashmina shawl with intricate detailing."
    }

    # Predict price
    try:
        price, info = predict_with_similarity_check(model, input_product, preproc)
        print("Predicted Price (INR):", round(price, 2))
        print("Similarity Info:", info)
    except ValueError as e:
        print("ERROR:", e)