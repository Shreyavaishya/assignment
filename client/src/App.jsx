import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function App() {
  const [business, setBusiness] = useState(null);
  const [rating, setRating] = useState(0);
  const [service, setService] = useState("");
  const [context, setContext] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedReview, setSelectedReview] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Your existing business ID
  const businessId = "6aae22574bb9ef68cc0fd230";

  // Fetch business details
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await fetch(`${API_URL}/api/business/${businessId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch business");
        }

        const data = await response.json();
        setBusiness(data);
      } catch (error) {
        console.error(error);
        setMessage("Failed to load business");
      }
    };

    fetchBusiness();
  }, []);

  const handleGenerate = async () => {
    if (!rating) {
      setMessage("Please select a rating");
      return;
    }

    setLoading(true);
    setMessage("");
    setSuggestions([]);
    setSelectedReview("");

    try {
      const response = await fetch(`${API_URL}/api/reviews/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          businessType: business?.type,
          service,
          context,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate review");
      }

      setSuggestions(data.suggestions);

      if (rating >= 4) {
        setFeedbackType("positive");
      } else {
        setFeedbackType("needs_attention");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedReview.trim()) {
      setMessage("Please select or write a review");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId,
          rating,
          service,
          context,
          generatedSuggestions: suggestions,
          finalText: selectedReview,
          feedbackType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      setMessage("Review submitted successfully!");

      // Reset form
      setRating(0);
      setService("");
      setContext("");
      setSuggestions([]);
      setSelectedReview("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Smart Review</h1>

        {business && (
          <div className="business-card">
            <h2>{business.name}</h2>
            <p>{business.type}</p>
          </div>
        )}

        <div className="form-section">
          <h3>How was your experience?</h3>

          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={star <= rating ? "star selected" : "star"}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>

          <label>Service</label>
          <input
            type="text"
            placeholder="e.g. Haircut"
            value={service}
            onChange={(e) => setService(e.target.value)}
          />

          <label>Tell us about your experience</label>
          <textarea
            placeholder="e.g. Staff was polite and service was quick"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />

          <button
            className="generate-button"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Review"}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions">
            <h3>
              {rating >= 4
                ? "Choose a review"
                : "Private feedback suggestion"}
            </h3>

            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={
                  selectedReview === suggestion
                    ? "suggestion selected-review"
                    : "suggestion"
                }
              >
                <p>{suggestion}</p>

                <button onClick={() => setSelectedReview(suggestion)}>
                  Use this
                </button>
              </div>
            ))}

            {selectedReview && (
              <div className="edit-section">
                <label>Edit your review</label>

                <textarea
                  value={selectedReview}
                  onChange={(e) => setSelectedReview(e.target.value)}
                />

                <button
                  className="submit-button"
                  onClick={handleSubmit}
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        )}

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default App;

