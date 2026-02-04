import { useState } from "react";
import "./App.css";

function App() {
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);
    const [type, setType] = useState("");
    const [loading, setLoading] = useState(false);

    const generateNgrams = async (ngramType) => {
        if (!text.trim()) {
            alert("Please enter a sentence");
            return;
        }

        setLoading(true);
        setType(ngramType);
        setResult(null); // Clear previous result while loading

        try {
            //https://ngrams-backend.onrender.com/ngrams http://127.0.0.1:5000/ngrams
            const res = await fetch(
                "https://ngrams-backend.onrender.com/ngrams",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text }),
                }
            );

            if (!res.ok) throw new Error("Failed to fetch");

            const data = await res.json();
            setResult(data);
        } catch (error) {
            alert("Error generating N-Grams. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h2 className="title">📘 N-Gram Language Model</h2>
                <p className="subtitle">
                    Enter a sentence and select the N-Gram type
                </p>

                <textarea
                    rows="4"
                    className="textarea"
                    placeholder="Example: I love natural language processing"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <div className="button-group">
                    <button
                        className="btn unigram"
                        onClick={() => generateNgrams("unigram")}
                        disabled={loading}
                        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                        {loading && type === 'unigram' ? '...' : 'Unigram'}
                    </button>

                    <button
                        className="btn bigram"
                        onClick={() => generateNgrams("bigram")}
                        disabled={loading}
                        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                         {loading && type === 'bigram' ? '...' : 'Bigram'}
                    </button>

                    <button
                        className="btn trigram"
                        onClick={() => generateNgrams("trigram")}
                        disabled={loading}
                        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                         {loading && type === 'trigram' ? '...' : 'Trigram'}
                    </button>
                </div>

                {/* OUTPUT SECTION */}
                {result && (
                    <div className="output">
                        {type === "unigram" && (
                            <>
                                <h3>Unigrams</h3>
                                <p>{result.unigrams.join(", ")}</p>
                            </>
                        )}

                        {type === "bigram" && (
                            <>
                                <h3>Bigrams</h3>
                                <p>{result.bigrams.join(", ")}</p>
                            </>
                        )}

                        {type === "trigram" && (
                            <>
                                <h3>Trigrams</h3>
                                <p>{result.trigrams.join(", ")}</p>
                            </>
                        )}

                        {/* MODEL EVALUATION */}
                        <hr />
                        <h3>Model Evaluation</h3>
                        <p>
                            <strong>Perplexity:</strong> {result.perplexity}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
