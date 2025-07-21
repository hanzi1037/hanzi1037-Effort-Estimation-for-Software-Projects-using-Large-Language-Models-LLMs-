from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import fitz  # PyMuPDF for PDF text extraction
import openai
import json
import os
from database import users_collection
import chromadb
from helper_functions.project_description import create_project_description
from dotenv import load_dotenv
from auth import get_current_user
from fastapi import Depends
from datetime import datetime

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')

router = APIRouter()

# Function to extract text from PDF
def extract_text_from_pdf(file):
    """Extract text from an uploaded PDF file using PyMuPDF."""
    doc = fitz.open(stream=file.file.read(), filetype="pdf")
    text = "\n".join([page.get_text("text") for page in doc])
    return text

# Function to extract structured information using OpenAI
def extract_info_from_srs(srs_text):
    prompt = f"""
    You are an assistant that extracts structured information from SRS documents.
    Please extract the following information from the provided SRS text of a complete project and return it as a correct JSON object:

    - "Industry Sector"
    - "Organisation Type"
    - "Application Group"
    - "Application Type"
    - "Development Type" (Inhancement or New Development)
    - "Development Platform" (Defines the primary development platform, (as determined by the operating system used). PC, Mid Range (MR), Main Frame (MF) or Multi platform (Multi).)
    - "Functional Size" (Calculate it and give it in numbers)
    - "Adjusted Function Points" (Calculate it and give it in numbers)
    - "Input count"
    - "Output count"
    - "Enquiry count"
    - "File count"
    - "Interface count"
    - "Added count"

    SRS Text:
    \"\"\"
    {srs_text}
    \"\"\"

    The output should be a valid JSON object only, without any extra text.    
    """
    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": "You are a helpful assistant that extracts information from text."},
                  {"role": "user", "content": prompt}],
        response_format={ "type": "json_object" },
        temperature=0,
    )

    try:
        extracted_info = json.loads(response.choices[0].message.content.strip())
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse extracted JSON data.")

    return extracted_info

# Function to get OpenAI embedding
def get_embedding(text, model="text-embedding-3-large"):
    try:
        response = openai.embeddings.create(input=[text], model=model)
        return response.data[0].embedding
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embedding: {e}")

# Function to estimate effort using OpenAI
def get_effort_estimation(prompt):
    response = openai.chat.completions.create(
        model="o1",
        messages=[
            {"role": "developer", "content": "Formatting re-enabled\nYou are a project management expert who estimates software project efforts based on provided data."},     
            {"role": "user", "content": prompt},
        ],
        # temperature=0,
    )
    return response.choices[0].message.content

# FastAPI Endpoint for Effort Estimation
@router.post("/estimate-effort")
async def estimate_effort(
    srs_document: UploadFile = File(...),
    programming_language: str = Form(...),
    team_size: int = Form(...),
    development_methodologies: str = Form(...),
    development_techniques: str = Form(...),
    project_activity_scope: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    # Step 1: Extract text from the uploaded PDF
    srs_text = extract_text_from_pdf(srs_document)

    # Step 2: Extract structured information from the SRS
    extracted_info = extract_info_from_srs(srs_text)

    # Step 3: Combine extracted info with user inputs
    user_inputs = {
        "Primary Programming Language": programming_language,
        "Max Team Size": team_size,
        "Development Methodologies": development_methodologies,
        "Development Techniques": development_techniques,
        "Project Activity Scope": project_activity_scope
    }
    project_query = {**extracted_info, **user_inputs}

    # Step 4: Convert numeric fields to integers
    numeric_fields = ['Functional Size', 'Adjusted Function Points', 'Input count', 'Output count', 'Enquiry count', 'File count', 'Interface count', 'Added count', 'Max Team Size']
    for key in numeric_fields:
        if key in project_query:
            project_query[key] = int(project_query[key])

    # Step 5: Create project description
    query_project_text = create_project_description(
        project_query,
        present_effort=False,
        present_sprints=False,
        test_project=True
    )

    # Step 6: Get embedding and retrieve similar projects from ChromaDB
    query_embedding = get_embedding(query_project_text)
    chroma_client = chromadb.PersistentClient(path="chroma_db")
    collection = chroma_client.get_collection(name="isbsg_projects")
    results = collection.query(query_embeddings=[query_embedding], n_results=5)

    # Step 7: Construct effort estimation prompt
    effort_prompt = f"""
    You are an expert software project estimation assistant. Based on the following information, estimate the effort in person-hours for the new software project.\n\n

    New Project Description:\n
    {query_project_text}

    \nSimilar Past Project Descriptions:\n
    """
    for idx, description in enumerate(results["documents"]):
        effort_prompt += f"\nProject {idx+1}:\n{description}\n"

    effort_prompt += "\nPlease provide the estimated effort in person-hours for the new project, considering the descriptions of past similar projects, and considering all its' attributes."
    effort_prompt += "\nRemember: The past projects' effort is embedded within their descriptions."

    # Step 8: Get effort estimation from OpenAI
    estimated_effort = get_effort_estimation(effort_prompt)

    try:
        # Save history in DB
        new_history = {
            "pdf_name": srs_document.filename,
            "programming_language": programming_language,
            "development_methodologies": development_methodologies,
            "development_techniques": [tech.strip() for tech in development_techniques.split(",")],
            "project_activity_scope": [scope.strip() for scope in project_activity_scope.split(",")],
            "team_size": team_size,
            "estimated_effort": estimated_effort,
            "created_at": datetime.utcnow()
        }

        users_collection.update_one(
            {"_id": current_user["_id"]},
            {"$push": {"effort_history": new_history}}
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="An error occurred while saving effort history.")
    
    return {"estimated_effort": estimated_effort}

@router.get("/effort-history")
async def get_effort_history(current_user: dict = Depends(get_current_user)):
    user = users_collection.find_one({"_id": current_user["_id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    history = user.get("effort_history", [])
    return {"history": history}
