---
icon: lucide/wrench
---

## Core Philosophy: "Write Logic Once, Run Everywhere"

Instead of building two separate tools, we build one powerful Python library (`actuarial_core`) that powers both interfaces.

### 1. The Directory Tree (Monorepo)

```
/actuarial-workbench-monorepo
├── /src                         # The Shared Brain
│   └── /actuarial_core          # YOUR NEW PYTHON PACKAGE
│       ├── __init__.py
│       ├── engine.py            # Wraps chainladder (Math)
│       ├── copilot.py           # LLM Logic (Prompts, Explanations)
│       ├── reporting.py         # ASOP Report Generator
│       └── state.py             # Manages judgments/notes
│
├── /apps                        # The Interfaces
│   ├── /web_backend             # The FastAPI App (formerly main.py)
│   │   ├── main.py              # Imports actuarial_core
│   │   └── requirements.txt
│   │
│   └── /web_frontend            # The React App
│       ├── src/
│       └── package.json
│
├── /notebooks                   # The Jupyter Experience
│   ├── analysis_demo.ipynb
│   └── copilot_example.ipynb
│
├── pyproject.toml               # Makes src/ installed as a package
└── README.md
```

### 2. How the Components Talk

#### A. The Shared Core (`/src/actuarial_core`)

This is where `chainladder` lives. It doesn't know about HTML or HTTP. It only knows data.

**`engine.py` (Conceptual):**

```
import chainladder as cl

class ReservingSession:
    def __init__(self, df):
        self.triangle = cl.Triangle(df, ...)
        self.model = cl.Chainladder()
        self.judgments = [] # Store user notes here

    def calculate(self, overrides=None):
        # ... logic to run chainladder with overrides ...
        return results

    def add_judgment(self, note):
        self.judgments.append(note)
```

**`copilot.py` (Conceptual):**

```
class Copilot:
    def diagnose(self, session):
        # Logic to look at session.triangle
        # If age_1_factor > 2.0:
        #    return "High volatility detected in Age 1."
        pass
```

#### B. The Notebook Experience (`/notebooks`)

The user imports the core directly. They get the full power of your tool without the web UI.

```
# User's Jupyter Notebook
from actuarial_core.engine import ReservingSession
from actuarial_core.copilot import Copilot

# 1. Load Data
session = ReservingSession(my_dataframe)

# 2. Get AI Help
ai = Copilot()
print(ai.diagnose(session)) 
# Output: "High volatility detected in 2021..."

# 3. Calculate
results = session.calculate()

# 4. Generate Report
session.export_report("my_analysis.md")
```

#### C. The Web App (`/apps/web_backend`)

The FastAPI app becomes extremely thin. It just translates JSON to your Core Library calls.

```
# apps/web_backend/main.py
from fastapi import FastAPI
from actuarial_core.engine import ReservingSession

app = FastAPI()

@app.post("/calculate")
def calc(data: TriangleData):
    # Delegate to the core library
    session = ReservingSession(data.to_df())
    return session.calculate()
```

### 3. Benefits of this Structure

1. **Unified Prompts:** You tweak the "System Prompt" for the AI in `src/actuarial_core/copilot.py`, and BOTH the web app and the Jupyter notebook users get the smarter AI immediately.
    
2. **Reproducibility:** An actuary can start work in the Web App, export the state to JSON, and load it into a Jupyter Notebook (via `ReservingSession.load()`) to debug a complex issue using raw Python.
    
3. **Testing:** You only have to write unit tests for `actuarial_core`.
    

### 4. Implementation Steps

1. **Move Logic:** Take the logic currently inside `main.py` (the `calculate_reserves` function) and move it to `src/actuarial_core/engine.py`.
    
2. **Install Locally:** Run `pip install -e .` in the root folder. This installs your core library in "editable mode".
    
3. **Refactor FastAPI:** Change `main.py` to import from the new package.
    
4. **Create Notebook:** Create a notebook that imports the same package to prove it works in both places.