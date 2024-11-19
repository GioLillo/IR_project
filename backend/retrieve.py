import requests
from bs4 import BeautifulSoup
import json

# Save scraped data to JSON file
# Function to scrape content from a webpage
def website1(url):
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
                    "url" : url,
                    "header": header.text.strip(),
                    "description": description.text.strip()
                }
                results.append(result)
        else:
            print(f"Failed to fetch {url}")
            break
    return results



# def webstite2(url):

def website3(url):
    results = []
    h = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9,it;q=0.8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
    for i in range(1,100):
        response = requests.get(url+"&page="+str(i),headers=h)
        print(url+"&page="+str(i))
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            headers = soup.find_all('div', class_='new-styling flex mb-20 sm-mb-12')
            headers=headers[1:]
            descriptions = soup.find_all('p')
            descriptions=descriptions[4:]
            for s in headers:
                print(s.text.strip())
            counter=0
            for header, description in zip(headers, descriptions):
                counter+=1
                if counter==16:
                    break
                if header.text.strip()[0:10]=="Babysitter":
                    return results
                result = {
                    "url" : url,
                    "header": header.text.strip(),
                    "description": description.text.strip()
                }
                results.append(result)
        else:
            print(f"Failed to fetch {url}")
            break
    return results

def scrape_webpage(url):
    # if url=="https://en.babysits.ch/babysitter/lugano/":
    #     website1(url)
    # if url=="https://it.yoopies.ch/ricerca-babysitting/results?c=lugano":
    #     webstite2(url)
    if url=="https://babysitting24.ch/it/providers/search?q[place]=Lugano":
        website3(url)

    

urls = [
    "https://en.babysits.ch/babysitter/lugano/",
    # "https://it.yoopies.ch/ricerca-babysitting/results?c=lugano",
    "https://babysitting24.ch/it/providers/search?q[place]=Lugano"
]

scraped_data = []
for url in urls:
    data = scrape_webpage(url)
    if data is not None:
        scraped_data.append(data)
with open('data_retrieved.json', 'w') as file:
    json.dump(scraped_data, file, indent=4)