from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
model = SentenceTransformer('all-MiniLM-L6-v2')

@app.route('/embed', methods=['POST'])
def embed_text():
    data = request.json
    text = data['text']
    print("MYTAG", text)
    embedding = model.encode([text])[0].tolist()
    return jsonify({'embedding': embedding})

@app.route('/relevant-tags', methods=['POST'])
def get_relevant_tags():
    data = request.json
    top_tags = data['top_tags']  # List of tags
    print (top_tags)
    free_text = data['free_text']  # Free text

    # Generate embeddings for the top tags
    tag_embeddings = model.encode(top_tags)
    
    # Generate embedding for the free text
    free_text_embedding = model.encode([free_text])[0]

    # Calculate cosine similarity between free text and each tag
    similarities = cosine_similarity([free_text_embedding], tag_embeddings)[0]

    # Combine tags with their similarity scores
    tag_similarity = list(zip(top_tags, similarities))

    # Filter out tags with similarity score less than 0.5
    tag_similarity = [(tag, score) for tag, score in tag_similarity if score > 0.5]

    # Sort tags by similarity score in descending order
    sorted_tags = sorted(tag_similarity, key=lambda x: x[1], reverse=True)
    print (sorted_tags)
    # Convert sorted_tags from [('christmas', 0.6627885), ('presents', 0.6201527), ('holiday', 0.5242939), ('gifts', 0.51046026)] to ['christmas', 'presents', 'holiday', 'gifts']
    sorted_tags = [tag for tag, score in sorted_tags]
    return jsonify({'relevant_tags': sorted_tags})

if __name__ == '__main__':
    app.run(port=5001)
