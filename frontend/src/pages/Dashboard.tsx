import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import ReactMarkdown from "react-markdown";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Dashboard() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [programmingLanguage, setProgrammingLanguage] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [developmentMethodologies, setDevelopmentMethodologies] = useState("");
  const [selectedDevelopmentTechniques, setSelectedDevelopmentTechniques] = useState<string[]>([]);
  const [selectedProjectActivityScope, setSelectedProjectActivityScope] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  interface HistoryItem {
    _id: string;
    pdf_name: string;
    programming_language: string;
    team_size: string;
    development_methodologies: string;
    development_techniques: Array<string>;
    project_activity_scope: Array<string>;
    estimated_effort: string;
  }

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);

  // Options for checklists
  const devTechniquesOptions = [
    "Business Area Modelling",
    "Prototyping",
    "Data Modelling",
    "Object Oriented",
    "Continuous Integration",
    "Test Driven Development"
  ];

  const projectActivityScopeOptions = [
    "Specification",
    "Design",
    "Build",
    "Test",
    "Implement",
    "Proj Management",
    "Deployment",
    "Maintenance"
  ];

  const navigate = useNavigate();

  const getTokenExpiration = (token: string): number => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000; // ms
    } catch {
      return 0;
    }
  };

  const isTokenExpired = (token: string): boolean => {
    return Date.now() > getTokenExpiration(token);
  };

  // fetch history on load
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    fetchHistory();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0]);
    }
  };

  const submitEstimation = async () => {
    if (!pdfFile) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("srs_document", pdfFile);
      formData.append("programming_language", programmingLanguage);
      formData.append("team_size", teamSize);
      formData.append("development_methodologies", developmentMethodologies);
      // Join the selections as comma separated values
      formData.append("development_techniques", selectedDevelopmentTechniques.join(","));
      formData.append("project_activity_scope", selectedProjectActivityScope.join(","));

      const response = await axios.post("http://localhost:8000/api/estimate-effort", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data.estimated_effort);
      console.log(response.data.estimated_effort);
    } catch (err) {
      setError("An error occurred while processing your request. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8000/api/effort-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data.history);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const handleHistoryClick = (historyItem: HistoryItem) => {
    setSelectedHistory(historyItem);
    setSelectedDevelopmentTechniques(historyItem.development_techniques);
    setSelectedProjectActivityScope(historyItem.project_activity_scope);
  };

  const handleNewEstimation = () => {
    setSelectedHistory(null);
    setProgrammingLanguage("");
    setTeamSize("");
    setDevelopmentMethodologies("");
    setSelectedDevelopmentTechniques([]);
    setSelectedProjectActivityScope([]);
    setPdfFile(null);
    setResult(null);
  };

  // Toggle checkbox selection for checklists
  const toggleCheckbox = (option: string, selectedOptions: string[], setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* LEFT DRAWER */}
        <div className="w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-700 flex flex-col">
          <div className="p-2">
            <button
              onClick={handleNewEstimation}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
            >
              + New Effort Estimate
            </button>
            <h2 className="pt-4 text-lg font-bold text-gray-800 dark:text-white">Effort History</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {history.length === 0 ? (
              <p className="p-4 text-gray-500">No history yet.</p>
            ) : (
              history.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleHistoryClick(item)}
                  className={`
                    cursor-pointer px-4 py-2 text-sm border-t dark:bg-gray-900 border-b
                    border-gray-200 dark:border-gray-700
                    hover:bg-gray-50 dark:hover:bg-gray-800
                    ${selectedHistory?._id === item._id ? "dark:bg-gray-700" : "bg-transparent dark:bg-transparent"}
                    text-gray-800 dark:text-gray-200
                  `}
                >
                  {item.pdf_name}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center">Project Estimation</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Fill in the details to get an accurate estimation for your project.
          </p>

          {/* PDF Upload */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload SRS Document (PDF)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center px-4 py-6 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                {pdfFile
                  ? pdfFile.name
                  : selectedHistory
                  ? selectedHistory.pdf_name
                  : "Choose a PDF file"}
                </span>
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" disabled={!!selectedHistory}/>
              </label>
            </div>
          </div>

          {/* Project Details */}
          {/* Row 1: Programming Language and Team Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Programming Language
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 dark:bg-gray-700 dark:text-white"
                disabled={!!selectedHistory}
                value={selectedHistory ? selectedHistory.programming_language : programmingLanguage}
                onChange={(e) => setProgrammingLanguage(e.target.value)}
                placeholder="e.g., JavaScript, Python"
              />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team Size
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 dark:bg-gray-700 dark:text-white"
                disabled={!!selectedHistory}
                value={selectedHistory ? selectedHistory.team_size : teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                placeholder="e.g., 5"
              />
            </div>
          </div>

          {/* Row 2: Development Methodologies */}
          <div className="mt-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Development Methodologies
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 dark:bg-gray-700 dark:text-white"
                disabled={!!selectedHistory}
                value={selectedHistory ? selectedHistory.development_methodologies : developmentMethodologies}
                onChange={(e) => setDevelopmentMethodologies(e.target.value)}
                placeholder="e.g., Agile, Waterfall"
              />
            </div>
          </div>

          {/* Row 3: Development Techniques Checklist */}
          <div className="mt-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-shadow duration-300">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Development Techniques
              </label>
              <div className="flex flex-wrap gap-4">
                {devTechniquesOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      value={option}
                      checked={
                        selectedHistory ? 
                        selectedHistory.development_techniques.includes(option) :
                        selectedDevelopmentTechniques.includes(option)
                      }
                      onChange={() =>
                        toggleCheckbox(option, selectedDevelopmentTechniques, setSelectedDevelopmentTechniques)
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      disabled={!!selectedHistory}
                    />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Project Activity Scope Checklist */}
          <div className="mt-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-shadow duration-300">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Activity Scope
              </label>
              <div className="flex flex-wrap gap-4">
                {projectActivityScopeOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      value={option}
                      checked={
                        selectedHistory ? 
                        selectedHistory.project_activity_scope.includes(option) :
                        selectedProjectActivityScope.includes(option)
                      }
                      onChange={() =>
                        toggleCheckbox(option, selectedProjectActivityScope, setSelectedProjectActivityScope)
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      disabled={!!selectedHistory}
                    />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button & Result */}
          {!selectedHistory ? (
            <button
              onClick={async () => {
                await submitEstimation();
                fetchHistory(); // refresh history after new estimation
              }}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
            >
              Estimate Effort
            </button>
          ) : (
            <div className="w-full bg-blue-300 text-white px-6 py-3 rounded-lg font-semibold text-center">
              Viewing Previous Estimate
            </div>
          )}

          {loading && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
              <DotLottieReact
                src="https://lottie.host/e21cece5-76b0-4f14-902a-2b305b2d3db7/wtaImrbT7z.lottie"
                loop
                autoplay
                style={{ width: 200, height: 200 }}
              />
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                This may take up to 60 seconds.
              </p>
            </div>
          )}
          {error && <p className="text-red-600 text-center">{error}</p>}
          {selectedHistory && (
            <div className="prose prose-lg dark:prose-dark max-w-none p-4 bg-white text-gray-800 dark:text-white dark:bg-gray-800 rounded-lg shadow">
              <h2 className="font-semibold text-lg mb-2">Estimated Effort</h2>
              <ReactMarkdown>{selectedHistory.estimated_effort}</ReactMarkdown>
            </div>
          )}
          {!selectedHistory && result && (
            <div className="prose prose-lg dark:prose-dark max-w-none p-4 bg-white text-gray-800 dark:text-white dark:bg-gray-800 rounded-lg shadow">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
