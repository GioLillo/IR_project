import requests
from bs4 import BeautifulSoup
import json

# Save scraped data to JSON file
# Function to scrape content from a webpage
def scrape_webpage(url):
    results = []
    for i in range(1,100):
        response = requests.get(url+"?page="+str(i))
        print(url+"?page="+str(i))
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            headers = soup.find_all('div', class_='header')
            headers=headers[1:]
            descriptions = soup.find_all('div', class_='description')
            descriptions=descriptions[4:]
            counter=0
            for header, description in zip(headers, descriptions):
                counter+=1
                if counter==16:
                    break
                if header.text.strip()[0:10]=="Babysitter":
                    return results
                result = {
                    "header": header.text.strip(),
                    "description": description.text.strip()
                }
                results.append(result)
        else:
            print(f"Failed to fetch {url}")
            break
    return results

urls = [
    # "https://it.yoopies.ch/ricerca-babysitting/results?c=lugano",
    # "https://babysitting24.ch/it",
    "https://en.babysits.ch/babysitter/lugano/"
]

# Scrape data
scraped_data = []
for url in urls:
    data = scrape_webpage(url)
    if data is not None:
        scraped_data.append(data)

# Salva i dati estratti in un file JSON
with open('data_retrieved.json', 'w') as file:
    json.dump(scraped_data, file, indent=4)