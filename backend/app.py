from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

def generate_ngrams(words, n):
    return [' '.join(words[i:i+n]) for i in range(len(words) - n + 1)]

@app.route("/ngrams", methods=["POST"])
def ngrams():
    data = request.json
    text = data.get("text", "").lower()
    words = text.split()

    unigrams = generate_ngrams(words, 1)
    bigrams = generate_ngrams(words, 2)
    trigrams = generate_ngrams(words, 3)

    return jsonify({
        "unigrams": unigrams,
        "bigrams": bigrams,
        "trigrams": trigrams
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
