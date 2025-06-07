from agno.agent import Agent
from agno.app.fastapi.app import FastAPIApp
from agno.models.google import Gemini
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

basic_agent = Agent(
    name="Basic Agent",
    model=Gemini(id="gemini-2.0-flash", api_key=os.getenv("GEMINI_API_KEY")),
    add_history_to_messages=True,
    num_history_responses=3,
    add_datetime_to_instructions=True,
    markdown=True,
)

fastapi_app = FastAPIApp(
    agents=[basic_agent],
    name="Basic Agent",
    app_id="basic_agent",
    description="A basic agent that can answer questions and help with tasks.",
)

app = fastapi_app.get_app()

# For synchronous router:
# app = fastapi_app.get_app(use_async=False)

if __name__ == "__main__":
    fastapi_app.serve(app="main:app", port=8001, reload=True)