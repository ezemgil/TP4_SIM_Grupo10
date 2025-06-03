backend/
├── app/
│   ├── main.py                # Punto de entrada FastAPI
│   ├── api/                   # Rutas
│   │   └── simulator.py
│   ├── models/                # Clases de dominio: Persona, Evento, etc.
│   ├── services/              # Lógica principal de simulación
│   ├── utils/                 # Auxiliares: generación aleatoria, validaciones, etc.
│   └── config.py              # Configuraciones generales
├── requirements.txt
└── README.md


# Instalá dependencias (si usás entorno virtual)
pip install -r requirements.txt

# Ejecutá el servidor
PS C:\Users\Usuario\...\...\TP4> .venv/Scripts/activate
(.venv) PS C:\Users\Usuario\...\...\TP4> cd backend
(.venv) PS C:\Users\Usuario\...\...\TP4\backend> uvicorn app.main:app --reload
