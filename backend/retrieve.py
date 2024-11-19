import requests
from bs4 import BeautifulSoup
import json

# Save scraped data to JSON file

# Function to scrape content from a webpage
def scrape_webpage(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string if soup.title else "No Title"
        content = ' '.join(p.text for p in soup.find_all('p'))
        
        return {
            "url": url,
            "title": title,
            "content": content
        }
    else:
        print(f"Failed to fetch {url}")
        return None

# Example URLs to scrape
urls = [
    "https://it.yoopies.ch/ricerca-babysitting/results?c=lugano",
    "https://babysitting24.ch/it",
    "https://en.babysits.ch/babysitter/lugano/?query=Lugano,%20Ticino,%20Switzerland&lat=46.00501034768388&lng=8.952027820050716"
]

# Scrape data
scraped_data = [scrape_webpage(url) for url in urls if scrape_webpage(url) is not None]
with open('data_retrieved.json', 'w') as file:
    json.dump(scraped_data, file, indent=4)