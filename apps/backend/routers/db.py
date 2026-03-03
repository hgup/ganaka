import os
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from typing import Dict

ENGINE_REGISTRY: Dict[str, Engine] = {}
PROJECTS_DIR = "projects/"
DATABASE_FILE = "workbench.db"


engine = create_engine(f"sqlite:///{DATABASE_FILE}")

with engine.connect() as conn:
    conn.execute(
        text(
            """
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
    )
    conn.commit()



def _initialize_db_schema(engine: Engine):
    with engine.connect() as conn:
        conn.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS project_meta (
                    id TEXT PRIMARY KEY,
                    name TEXT,
                    canvas_json TEXT -- We'll store the React Flow state here!
                );
                """
            )
        )
        conn.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS project_tables (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    original_filename TEXT,
                    uploaded_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                    row_count INTEGER
                    table_type TEXT
                );
                """
            )
        )
        conn.commit()


def project_engine(project_id: str) -> Engine:
    if project_id in ENGINE_REGISTRY:
        return ENGINE_REGISTRY[project_id]

    os.makedirs(PROJECTS_DIR,exist_ok=True)
    db_path = os.path.join(PROJECTS_DIR, f"{project_id}.db")

    new_engine = create_engine(
        f"sqlite:///{db_path}",
        connect_args={"check_same_thread": False},
        pool_size=5,
        max_overflow=10,
    )

    _initialize_db_schema(new_engine)

    ENGINE_REGISTRY[project_id] = new_engine
    return new_engine

