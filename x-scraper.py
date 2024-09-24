#!/usr/bin/env python
# coding: utf-8

# In[ ]:


get_ipython().system('twscrape add_accounts /bin/accounts.txt username:password:email:email_password')
get_ipython().system('twscrape login_accounts')

import asyncio
import json
from twscrape import API, gather
from datetime import datetime
import nest_asyncio
import jmespath

# Allow running nested event loops in a Jupyter Notebook
nest_asyncio.apply()

async def get_user_tweets():
    api = API()  # Assuming you have already added and logged in with the Twitter account

    # Replace 'target_username' with the actual Twitter username you want to retrieve tweets from
    target_username = 'btcordinal'

    # Get the user ID based on the username
    user = await api.user_by_login(target_username)
    
    # Check if the user was found
    if user:
        # Get the last 22 tweets from the user
        tweets = [tweet.dict() async for tweet in api.user_tweets(user.id, limit=22)]

        # Convert datetime objects to string
        for tweet in tweets:
            tweet['createdAt'] = tweet['createdAt'].isoformat() if 'createdAt' in tweet else None

        # Print the tweet information
        for tweet in tweets:
            print(f'Tweet ID: {tweet["id"]}, Content: {tweet["rawContent"]}')

        # Save the tweets to a JSON file
        with open('user_tweets.json', 'w', encoding='utf-8') as json_file:
            json.dump(tweets, json_file, ensure_ascii=False, indent=4, default=str)

# Run the async function in the notebook
await get_user_tweets()


# Function to apply JMESPath expression to JSON data
def apply_jmespath(expression, json_file):
    # Read JSON data from file
    with open(json_file, 'r', encoding='utf-8') as file:
        json_data = json.load(file)

    # Applying the JMESPath expression
    result = jmespath.search(expression, json_data)

    return result

# JMESPath expression
expression = "[?contains(rawContent, 'giveaway')].rawContent"

# Path to your JSON file (replace 'your_file.json' with the actual file path)
json_file_path = '/home/mercurius/Scraperz/Notebook/user_tweets.json'

# Applying the JMESPath expression to the JSON file
result = apply_jmespath(expression, json_file_path)

# Removing duplicates by converting the list to a set and back to a list
result_no_duplicates = list(set(result))

# Printing the result without duplicates
print(result_no_duplicates)

def get_twitter_data(target_username):
       # Replace the rest of your function logic here
       # ...

