import { useState } from "react";
import "./App.css";

function App() {
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);
    const [type, setType] = useState("");

    const generateNgrams = async (ngramType) => {
        if (!text.trim()) {
            alert("Please enter a sentence");
            return;
        }

        setType(ngramType);
        //https://ngrams-backend.onrender.com/ngrams http://127.0.0.1:5000/ngrams
        const res = await fetch(
            "https://ngrams-backend.onrender.com/ngrams",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            }
        );

        const data = await res.json();
        setResult(data);
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
                    >
                        Unigram
                    </button>

                    <button
                        className="btn bigram"
                        onClick={() => generateNgrams("bigram")}
                    >
                        Bigram
                    </button>

                    <button
                        className="btn trigram"
                        onClick={() => generateNgrams("trigram")}
                    >
                        Trigram
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
