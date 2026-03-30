import React, { useCallback, useEffect, useMemo, useState } from "react";
import CenteredImage from "../components/CenteredImage";
import backgroundImg from "../assets/background.jpg";

const emptyCharacter = {
  name: "",
  status: "",
  species: "",
  gender: "",
  origin: "",
  location: "",
  email: "",
};

const SubmitPage = ({ apiBaseUrl, token }) => {
  const [characterData, setCharacterData] = useState(emptyCharacter);
  const [imageFile, setImageFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token],
  );

  const loadSubmissions = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/characters/submissions`, {
        headers: authHeaders,
      });
      if (!response.ok) throw new Error("Failed to load submissions");
      const payload = await response.json();
      setSubmissions(Array.isArray(payload) ? payload : []);
    } catch (loadError) {
      setError(loadError.message || "Failed to load submissions");
    }
  }, [apiBaseUrl, authHeaders]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCharacterData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      const formData = new FormData();
      Object.entries(characterData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(`${apiBaseUrl}/characters/submissions`, {
        method: "POST",
        headers: authHeaders,
        body: formData,
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to submit character");
      }

      setCharacterData(emptyCharacter);
      setImageFile(null);
      setMessage("Character submitted successfully.");
      await loadSubmissions();
    } catch (submitError) {
      setError(submitError.message || "Failed to submit character");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${apiBaseUrl}/characters/submissions/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!response.ok) throw new Error("Failed to delete submission");
      setMessage("Submission deleted.");
      await loadSubmissions();
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete submission");
    }
  };

  return (
    <div className="submit-page relative">
      <CenteredImage imageUrl={backgroundImg} className="opacity-50" />
      <div className="submit-form-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 bg-opacity-75 p-8 rounded-lg shadow-lg text-center w-full max-w-3xl">
        <h2 className="font-bold text-2xl mb-6">Submit New Character</h2>
        <form onSubmit={handleSubmit} className="submit-form">
          <label className="block mb-2">Name:</label>
          <input type="text" name="name" value={characterData.name} onChange={handleInputChange} required className="input-field w-full mb-4" />
          <label className="block mb-2">Status:</label>
          <input type="text" name="status" value={characterData.status} onChange={handleInputChange} required className="input-field w-full mb-4" />
          <label className="block mb-2">Species:</label>
          <input type="text" name="species" value={characterData.species} onChange={handleInputChange} required className="input-field w-full mb-4" />
          <label className="block mb-2">Gender:</label>
          <input type="text" name="gender" value={characterData.gender} onChange={handleInputChange} required className="input-field w-full mb-4" />
          <label className="block mb-2">Origin:</label>
          <input type="text" name="origin" value={characterData.origin} onChange={handleInputChange} required className="input-field w-full mb-4" />
          <label className="block mb-2">Location:</label>
          <input type="text" name="location" value={characterData.location} onChange={handleInputChange} required className="input-field w-full mb-4" />
          <label className="block mb-2">Upload Photo:</label>
          <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} className="input-field w-full mb-4" />
          <label className="block mb-2">Email:</label>
          <input type="email" name="email" value={characterData.email} onChange={handleInputChange} required className="input-field w-full mb-6" />
          {error ? <p className="rm-error mb-2">{error}</p> : null}
          {message ? <p className="text-green-700 mb-2">{message}</p> : null}
          <button type="submit" disabled={isSaving} className="btn-primary bg-blue-500 px-8 py-3 rounded-lg text-white text-lg mt-4 border border-blue-500">
            {isSaving ? "Submitting..." : "Submit"}
          </button>
        </form>

        <div className="mt-8 text-left">
          <h3 className="text-xl font-bold mb-3">My Submissions</h3>
          <ul className="space-y-2">
            {submissions.map((item) => (
              <li key={item._id} className="bg-white rounded-md p-3 flex items-center justify-between">
                <span>
                  {item.name} ({item.species}) - {item.status}
                </span>
                <button
                  type="button"
                  className="bg-red-600 text-white px-3 py-1 rounded-md"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </li>
            ))}
            {!submissions.length ? <li className="text-gray-700">No submissions yet.</li> : null}
          </ul>
        </div>
      </div>
    </div>
  );
};

SubmitPage.title = "Submit";

export default SubmitPage;
