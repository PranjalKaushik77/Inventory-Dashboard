import math
import pandas as pd
import matplotlib.pyplot as plt
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import io
import base64
from typing import Dict, Any

app = FastAPI()

# CORS Configuration (for development; restrict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def replace_nan(obj):
    """Recursively replace NaN with None in dictionaries and lists."""
    if isinstance(obj, dict):
        return {k: replace_nan(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [replace_nan(item) for item in obj]
    elif isinstance(obj, float) and math.isnan(obj):
        return None
    else:
        return obj

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        
        # Process file based on extension, skipping the top 2 rows so that row 3 becomes header
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents), skiprows=2, header=0)
        elif file.filename.endswith('.xlsx'):
            df = pd.read_excel(io.BytesIO(contents), skiprows=2, header=0)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        # Debug: Print the columns to verify headers
        print("Uploaded columns:", df.columns.tolist())
        
        # Drop entirely empty columns, if any
        df = df.dropna(axis=1, how='all')
        
        # Rename columns using the actual header values
        df = df.rename(columns={
            "Material name": "name",
            "Vendor name": "vendor",
            "Balance qty": "balance_qty",
            "Min": "min",
            "Max": "max"
        })
        
        # Drop rows missing 'name'
        df = df.dropna(subset=['name'])
        
        # Convert relevant columns to numeric
        numeric_cols = ['balance_qty', 'min', 'max']
        df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors='coerce')
        
        # ---- Unified Color Assignment ----
        # Categories:
        # - Overstocked (red): balance_qty > max
        # - Understocked (yellow): balance_qty < min
        # - Critical (orange): balance_qty is between min (inclusive) and min + 0.25*(max-min)
        # - Normal (green): everything else
        df['colour'] = None
        
        # Overstocked: above maximum
        df.loc[df['balance_qty'] > df['max'], 'colour'] = 'red'
        # Understocked: below minimum
        df.loc[df['balance_qty'] < df['min'], 'colour'] = 'yellow'
        # Critical: between min (inclusive) and min + 0.25*(max-min)
        df.loc[
            (df['balance_qty'] >= df['min']) &
            (df['balance_qty'] < df['min'] + 0.25 * (df['max'] - df['min'])),
            'colour'
        ] = 'orange'
        # Normal: all remaining items
        df.loc[df['colour'].isna(), 'colour'] = 'green'
        
        # Debug: Print color distribution to verify categorization
        print("Color distribution:", df['colour'].value_counts().to_dict())
        
        # Separate categories for output (as needed)
        overstocked = df[df['colour'] == 'red'][['name', 'vendor']]
        understocked = df[df['colour'] == 'yellow'][['name', 'vendor']]
        critical = df[df['colour'] == 'orange'][['name', 'vendor']]
        
        # Define a color mapping for charts
        color_map = {
            'red': 'Overstocked',
            'yellow': 'Understocked',
            'orange': 'Critical',
            'green': 'Normal'
        }
        
        # Create charts
        bar_chart = create_bar_chart(df)
        pie_chart = create_pie_chart(df, color_map)
        
        result = {
            "overstocked": overstocked.to_dict(orient='records'),
            "understocked": understocked.to_dict(orient='records'),
            "critical": critical.to_dict(orient='records'),
            "bar_labels": df['name'].tolist(),
            "bar_values": df['balance_qty'].tolist(),
            "bar_colors": df['colour'].tolist(),
            "pie_labels": [color_map.get(c, c) for c in df['colour'].value_counts().index],
            "pie_values": df['colour'].value_counts().values.tolist(),
            "pie_colors": df['colour'].value_counts().index.tolist(),
            "color_counts": df['colour'].value_counts().to_dict(),
            "charts": {
                "bar": bar_chart,
                "pie": pie_chart
            }
        }
        
        # Replace any NaN values with None for JSON serialization
        result = replace_nan(result)
        return result
        
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing required column: {str(e)}")
    except Exception as e:
        print("Error in analyze_data:", e)
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

def create_bar_chart(df: pd.DataFrame) -> str:
    plt.figure(figsize=(12, 6))
    plt.bar(df['name'], df['balance_qty'], color=df['colour'])
    plt.xlabel('Products')
    plt.ylabel('Quantity')
    plt.title('Inventory Status')
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight')
    buffer.seek(0)
    chart_data = base64.b64encode(buffer.read()).decode('utf-8')
    plt.close()
    return chart_data

def create_pie_chart(df: pd.DataFrame, color_map: Dict[str, str]) -> str:
    color_counts = df['colour'].value_counts()
    plt.figure(figsize=(8, 8))
    plt.pie(
        color_counts,
        labels=[color_map.get(c, c) for c in color_counts.index],
        colors=color_counts.index,  # These must be valid matplotlib color names
        autopct='%1.1f%%',
        startangle=140
    )
    plt.legend(title="Stock Status", loc="center left", bbox_to_anchor=(1, 0.5))
    plt.tight_layout()
    
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    chart_data = base64.b64encode(buffer.read()).decode('utf-8')
    plt.close()
    return chart_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
