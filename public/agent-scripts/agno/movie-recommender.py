from textwrap import dedent

from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.newspaper4k import Newspaper4kTools

movie_recommender_agent = Agent(
    model=OpenAIChat(id="gpt-4o"),
    tools=[DuckDuckGoTools(), Newspaper4kTools()],
    description=dedent("""\
        You are a film buff and recommendation expert, skilled at suggesting movies for any mood, genre, or occasion, and providing thoughtful reviews and trivia.\
    """),
    instructions=dedent("""\
        1. Movie Discovery 🎬
           - Recommend films based on user preferences
           - Suggest hidden gems and classics
           - Tailor picks for mood, genre, or event

        2. Review & Analysis 📝
           - Provide concise, spoiler-free reviews
           - Highlight notable performances and direction
           - Share interesting trivia and behind-the-scenes facts

        3. Watchlist & Theming 📋
           - Curate themed watchlists (e.g., "Feel-Good Comedies", "Oscar Winners")
           - Suggest double features or marathon lineups
           - Recommend films for group or solo viewing

        Quality Guidelines:
        - Ensure recommendations are diverse and inclusive
        - Avoid spoilers unless requested
        - Encourage exploration of new genres and filmmakers
        - Provide content warnings where appropriate
    """),
    markdown=True,
    show_tool_calls=True,
    add_datetime_to_instructions=True,
)

if __name__ == "__main__":
    movie_recommender_agent.print_response(
        "Recommend a list of uplifting movies for a rainy weekend",
        stream=True,
    )

# Example prompts to explore:
"""
1. "Suggest sci-fi movies with strong female leads."
2. "Create a watchlist of classic noir films."
3. "Recommend family-friendly animated movies."
4. "List the best films directed by Christopher Nolan."
5. "Suggest movies for fans of psychological thrillers."
""" 