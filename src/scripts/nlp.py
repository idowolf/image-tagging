import sys
import json
import requests
from sentence_transformers import SentenceTransformer, util
import numpy as np

# Load the pre-trained SentenceTransformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

def fetch_top_tags():
    response = requests.get('http://localhost:5000/top-tags')
    if response.status_code == 200:
        return [tag['name'] for tag in response.json()]
    else:
        response.raise_for_status()

# Function to get the 10 most relevant tags
def get_relevant_tags(tags, free_text, top_n=10):
    # Embed the tags and the free text
    tag_embeddings = model.encode(tags, convert_to_tensor=True)
    text_embedding = model.encode(free_text, convert_to_tensor=True)
    
    # Compute cosine similarities between the text and all tags
    cosine_scores = util.pytorch_cos_sim(text_embedding, tag_embeddings)[0]
    
    # Move tensor to CPU and convert to NumPy array
    cosine_scores = cosine_scores.cpu().numpy()
    
    # Get the indices of the top_n tags with highest similarity scores
    top_indices = np.argsort(cosine_scores)[::-1][:top_n]
    
    # Return the most relevant tags
    return [tags[idx] for idx in top_indices]

if __name__ == "__main__":
    free_text = sys.argv[1]
    tags = fetch_top_tags()
    relevant_tags = get_relevant_tags(tags, free_text)
    print(json.dumps(relevant_tags))  # Corrected to print relevant_tags
