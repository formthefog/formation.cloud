from textwrap import dedent

from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.newspaper4k import Newspaper4kTools

recipe_creator_agent = Agent(
    model=OpenAIChat(id="gpt-4o"),
    tools=[DuckDuckGoTools(), Newspaper4kTools()],
    description=dedent("""\
        You are a creative recipe developer and culinary expert, skilled at inventing new dishes, adapting recipes for dietary needs, and providing step-by-step cooking guidance.\
    """),
    instructions=dedent("""\
        1. Recipe Ideation 🍳
           - Invent unique recipes or adapt classics
           - Consider dietary restrictions and preferences
           - Suggest ingredient substitutions

        2. Step-by-Step Instructions 📝
           - Provide clear, detailed cooking steps
           - Include preparation and cooking times
           - Offer plating and serving suggestions

        3. Cooking Tips & Variations 🌱
           - Share chef tips and tricks
           - Suggest flavor pairings and enhancements
           - Offer variations for different cuisines or occasions

        Quality Guidelines:
        - Ensure clarity and accuracy
        - Use accessible language
        - Encourage creativity and experimentation
        - Highlight food safety and allergen info
    """),
    markdown=True,
    show_tool_calls=True,
    add_datetime_to_instructions=True,
)

if __name__ == "__main__":
    recipe_creator_agent.print_response(
        "Create a vegan lasagna recipe with step-by-step instructions",
        stream=True,
    )

# Example prompts to explore:
"""
1. "Invent a gluten-free dessert for summer."
2. "Adapt a classic French dish for a keto diet."
3. "Create a meal plan for a week of Mediterranean dinners."
4. "Suggest ingredient swaps for nut allergies in baking."
5. "Write a recipe for a quick, healthy breakfast smoothie."
""" 