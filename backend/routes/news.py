from flask import Blueprint, request, jsonify, Response
import feedparser
import json

import requests
from bs4 import BeautifulSoup

news = Blueprint('news', __name__, url_prefix='/news')
sources_file_name = 'sources.json'

sources = [
    {
        'name': 'Kotaku',
        'url': 'https://kotaku.com/rss',
        'active': True
    },
    {
        'name': 'Polygon',
        'url': 'https://www.polygon.com/rss/index.xml',
        'active': True
    },
    {
        'name': 'IGN',
        'url': 'https://feeds.ign.com/ign/games-all',
        'active': True
    },
    {
        'name': 'GameSpot',
        'url': 'https://www.gamespot.com/feeds/mashup',
        'active': True
    },
    {
        'name': 'Eurogamer',
        'url': 'https://www.eurogamer.net/feed/news',
        'active': True
    },
    {
        'name': 'Rock Paper Shotgun',
        'url': 'https://www.rockpapershotgun.com/feed/news',
        'active': True
    },
    {
        'name': 'PC Gamer',
        'url': 'https://www.pcgamer.com/rss',
        'active': True
    },
    {
        'name': 'Game Informer',
        'url': 'https://www.gameinformer.com/news.xml',
        'active': True
    }
]

# Update the sources with the user's preferred sources
try:
    with open(sources_file_name, 'r') as f:
        sources = json.load(f)
except:
    with open(sources_file_name, 'w') as f:
        f.write(json.dumps(sources))

def sort_article(article):
    published = article['published_parsed']
    return published[0] << 24 | published[1] << 16 | published[2] << 8 | published[3]

# Route to get the list of gaming news articles
@news.route('/feed', methods=['GET'])
def get_articles():
    results = []
    num_articles_per_source = 10
    for source in [source for source in sources if source['active']]:
        try:
            d = feedparser.parse(source['url'])
        except:
            print('Error parsing feed:', source['url'], flush=True)
            continue
        for entry in d.entries[:num_articles_per_source]:
            # Get the image from the entry metadata
            image = None
            description = None
            if 'media_content' in entry:
                image = entry.media_content[0]['url']
            elif 'media_thumbnail' in entry:
                image = entry.media_thumbnail[0]['url']

            if not image:
                try:
                    html = requests.get(entry.link).text
                    soup = BeautifulSoup(html, 'html.parser')
                    image = soup.find('meta', property='og:image')['content']
                    description = soup.find('meta', property='og:description')['content']
                except:
                    print('Error parsing HTML:', entry.link, flush=True)

            results.append({
                'source': source['name'],
                'title': entry.title,
                'link': entry.link,
                'published': entry.published,
                'published_parsed': entry.published_parsed,
                'summary': entry.summary,
                'description': description if description else entry.summary,
                'image': image
            })

    # Sort the results by published date
    results.sort(key=sort_article, reverse=True)
    
    return jsonify(results)

# Route to get the list of gaming news sources
@news.route('/sources', methods=['GET'])
def get_sources():
    # Check if the user has preferred sources saved
    try:
        with open(sources_file_name, 'r') as f:
            saved_sources = json.load(f)
    except:
        # Initialize the user's preferred sources
        with open(sources_file_name, 'w') as f:
            f.write(json.dumps(sources))
        saved_sources = sources

    return jsonify(saved_sources)

# Route to set the user's preferred news sources
@news.route('/sources', methods=['POST'])
def set_sources():
    new_sources = request.json['sources']

    # Save the sources to a file as json
    with open(sources_file_name, 'w') as f:
        f.write(json.dumps(new_sources))

    # Update the sources
    global sources
    sources = new_sources

    return Response(status=200)