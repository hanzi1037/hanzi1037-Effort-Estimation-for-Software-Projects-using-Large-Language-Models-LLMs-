# 🔍 Effort Estimation for Software Projects using LLMs and RAG

A smart, document-aware system that estimates the development effort for software projects by analyzing Software Requirements Specification (SRS) documents using Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG). This project bridges the gap between traditional estimation techniques and modern AI-powered methods, providing accurate and context-aware effort predictions.

## 🚀 Overview

Software effort estimation is a critical and challenging part of project planning. Existing tools rely on structured data or subjective expert input, often ignoring rich contextual information present in requirement documents. This system:

- Reads SRS documents
- Extracts meaningful project attributes using LLMs
- Retrieves similar historical projects via vector similarity search
- Generates context-aware effort estimates using a RAG pipeline

## 🎯 Key Features

- ✅ Upload SRS PDFs and get instant effort estimation
- ✅ Automated attribute extraction via OpenAI LLMs
- ✅ Vector similarity search on ISBSG historical data using ChromaDB
- ✅ Contextual and explainable predictions
- ✅ History panel to view and compare previous estimations

## 🧠 Technologies Used

| Layer | Tools |
|------|-------|
| **Frontend** | React, TypeScript, Tailwind CSS |
| **Backend** | FastAPI, Python, PyMuPDF, OpenAI API |
| **Database** | MongoDB (metadata), ChromaDB (vector embeddings) |
| **ML/AI** | OpenAI's `text-embedding-3-large` for vector generation |

## 📁 Folder Structure

project-root/
│
├── backend/
│ ├── api/
│ ├── embeddings/
│ ├── models/
│ └── utils/
│
├── frontend/
│ ├── components/
│ ├── pages/
│ └── styles/
│
├── chroma_db/ # vector DB
├── .env
└── README.md


## 🧪 Evaluation Results

| Metric | Value |
|--------|-------|
| MMRE (Mean Magnitude of Relative Error) | 10.74% |
| MAE (Mean Absolute Error) | 188.54 person-hours |
| RMSE (Root Mean Squared Error) | 923.01 |
| Context Precision (RAGAS) | 0.9760 |

## 📌 How It Works

1. **Upload** an SRS document
2. **LLM** extracts structured features like input/output counts, project type, size, etc.
3. **ChromaDB** retrieves similar historical projects using vector embeddings
4. **RAG pipeline** generates final effort prediction with textual justification

## 🔧 Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js
- OpenAI API Key

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

**Frontend Setup**
cd frontend
npm install
npm run dev
