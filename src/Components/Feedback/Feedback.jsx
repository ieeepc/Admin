import React, { useState, useEffect } from "react";
import "./Feedback.css";
import BASE_URL from "../../service/BaseAddress";

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [username, setUsername] = useState(""); // Capture username
  const [password, setPassword] = useState(""); // Capture feed_password
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  // Fetch feedback messages
  const fetchFeedback = async () => {
    const token = localStorage.getItem("auth-token");
    try {
      const response = await fetch(`${BASE_URL}/api/feedback/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }
      const data = await response.json();
      setFeedbackList(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setFeedbackList([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFeedback();
    }
  }, [isAuthenticated]);

  // Handle password authentication via API
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/admin/verify-feed-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, feed_password: password }), // Send username and feed_password
      });

      const data = await response.json();
      if (response.ok) {
        setIsAuthenticated(true); // Allow access if password is correct
        setError("");
      } else {
        setError(data.message || "Incorrect password. Please try again.");
        setPassword(""); // Reset password field
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="chat-container">
      {!isAuthenticated ? (
        <div className="password-container">
          <h2>Enter Credentials to Access Feedback</h2>
          <form className="form-input" onSubmit={handlePasswordSubmit}>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="username-input"
              required
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              required
            />
            <button type="submit" className="password-submit">
              Submit
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      ) : (
        <>
          <h2>Feedback Messages</h2>
          <div className="chat-messages">
            {feedbackList.length > 0 ? (
              feedbackList.map((item, index) => (
                <div className="chat-message" key={index}>
                  <p className="message-text">{item.feedback}</p>
                  <p className="message-time">
                    {new Date(item.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              ))
            ) : (
              <p className="no-feedback">No feedback messages yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Feedback;
