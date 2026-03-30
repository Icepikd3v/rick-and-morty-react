import React, { useEffect, useState } from "react";
import SearchResultsCard from "../components/SearchResultCard";
import { demoCharacters } from "../constants/demoCharacters";

const SearchPage = () => {
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) return;
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(query)}&page=${page}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setSearchResults(data.results || []);
        setTotalPages(data.info?.pages || 1);
      } catch {
        // Demo fallback so showcase remains usable when API is unavailable.
        const normalized = query.toLowerCase();
        const fallback = demoCharacters.filter((item) =>
          item.name.toLowerCase().includes(normalized),
        );
        setSearchResults(fallback);
        setTotalPages(1);
        setError(
          "Live API unavailable right now. Showing local demo characters instead.",
        );
      } finally {
        setSearched(true);
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!queryInput.trim()) return;
    setPage(1);
    setQuery(queryInput.trim());
  };

  return (
    <div className="rm-search-page">
      <div className="rm-search-panel">
        <p className="rm-eyebrow">Character Lookup</p>
        <h2>Search The Multiverse</h2>
        <form onSubmit={handleSearchSubmit} className="rm-search-form">
          <input
            type="text"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Try: Rick, Morty, Summer..."
            className="rm-search-bar"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>
        {error ? <p className="rm-error">{error}</p> : null}
      </div>

      {searched ? (
        <>
          <div className="rm-results-grid">
            {searchResults.length ? (
              searchResults.map((result) => (
                <SearchResultsCard key={result.id} character={result} />
              ))
            ) : (
              <p className="rm-muted">No characters found for this query.</p>
            )}
          </div>

          <div className="rm-pagination">
            <button
              onClick={() => setPage((prevPage) => Math.max(1, prevPage - 1))}
              disabled={page <= 1 || isLoading}
            >
              Previous
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((prevPage) => Math.min(totalPages, prevPage + 1))}
              disabled={page >= totalPages || isLoading}
            >
              Next
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};

SearchPage.title = "Search";

export default SearchPage;
