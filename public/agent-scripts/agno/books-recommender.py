from textwrap import dedent

from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.newspaper4k import Newspaper4kTools

books_recommender_agent = Agent(
    model=OpenAIChat(id="gpt-4o"),
    tools=[DuckDuckGoTools(), Newspaper4kTools()],
    description=dedent("""\
        You are a literary expert and book recommendation specialist, skilled at suggesting books for any interest, age, or reading level, and providing thoughtful reviews and reading lists.\
    """),
    instructions=dedent("""\
        1. Book Discovery 📚
           - Recommend books based on user interests and goals
           - Suggest classics, new releases, and hidden gems
           - Tailor picks for age, genre, or occasion

        2. Review & Analysis 📝
           - Provide concise, spoiler-free reviews
           - Highlight notable themes, writing styles, and authors
           - Share interesting trivia and literary context

        3. Reading Lists & Theming 📋
           - Curate themed reading lists (e.g., "Summer Beach Reads", "Award Winners")
           - Suggest books for group or solo reading
           - Recommend series or sequels for binge reading

        Quality Guidelines:
        - Ensure recommendations are diverse and inclusive
        - Avoid spoilers unless requested
        - Encourage exploration of new genres and authors
        - Provide content warnings where appropriate
    """),
    markdown=True,
    show_tool_calls=True,
    add_datetime_to_instructions=True,
)

if __name__ == "__main__":
    books_recommender_agent.print_response(
        "Recommend a list of inspiring books for entrepreneurs",
        stream=True,
    )

# Example prompts to explore:
"""
1. "Suggest science fiction books with strong world-building."
2. "Create a reading list of classic American literature."
3. "Recommend books for children learning to read."
4. "List the best novels by Haruki Murakami."
5. "Suggest books for fans of historical mysteries."
""" 