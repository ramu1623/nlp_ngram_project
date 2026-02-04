from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import Counter
import math
import os

app = Flask(__name__)

# ✅ Explicit CORS configuration (IMPORTANT for Render)
CORS(app, resources={r"/*": {"origins": "*"}})

# ------------------ N-gram Generator ------------------
def generate_ngrams(words, n):
    return [tuple(words[i:i + n]) for i in range(len(words) - n + 1)]

# ------------------ Train Bigram Language Model ------------------
def train_bigram_model(words):
    unigrams = Counter(words)
    bigrams = Counter(generate_ngrams(words, 2))

    bigram_prob = {}
    for (w1, w2), count in bigrams.items():
        bigram_prob[(w1, w2)] = count / unigrams[w1]

    return unigrams, bigrams, bigram_prob

# ------------------ Perplexity Calculation ------------------
def calculate_perplexity(words, bigram_prob):
    # Perplexity undefined for less than 2 words
    if len(words) < 2:
        return None

    N = len(words) - 1
    log_prob_sum = 0

    for i in range(1, len(words)):
        pair = (words[i - 1], words[i])

        # Unseen bigram → infinite perplexity
        if pair not in bigram_prob:
            return float("inf")

        log_prob_sum += math.log(bigram_prob[pair])

    return math.exp(-log_prob_sum / N)

# ------------------ API Route ------------------
@app.route("/ngrams", methods=["POST"])
def ngrams():
    data = request.json
    text = data.get("text", "").lower()
    words = text.split()

    # Generate N-grams
    unigrams = generate_ngrams(words, 1)
    bigrams = generate_ngrams(words, 2)
    trigrams = generate_ngrams(words, 3)

    # Train model
    _, _, bigram_prob = train_bigram_model(words)

    # Calculate perplexity
    perplexity_raw = calculate_perplexity(words, bigram_prob)

    if perplexity_raw is None:
        perplexity = "Not defined (need at least 2 words)"
    elif perplexity_raw == float("inf"):
        perplexity = "Infinite (unseen bigram)"
    else:
        perplexity = round(perplexity_raw, 4)

    return jsonify({
        "unigrams": [' '.join(u) for u in unigrams],
        "bigrams": [' '.join(b) for b in bigrams],
        "trigrams": [' '.join(t) for t in trigrams],
        "bigram_probabilities": {
            f"{w1} {w2}": round(prob, 4)
            for (w1, w2), prob in bigram_prob.items()
        },
        "perplexity": perplexity
    })

# ------------------ Health Check Route (Optional but Recommended) ------------------
@app.route("/", methods=["GET"])
def home():
    return "N-Gram Language Model API is running"

# ------------------ Run App (Local + Render) ------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
