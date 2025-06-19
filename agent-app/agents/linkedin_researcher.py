"""LinkedIn researcher agent that uses ContactOut API to extract LinkedIn profile information."""

from os import getenv
from textwrap import dedent
from typing import Optional

from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.storage.agent.postgres import PostgresAgentStorage
from agno.tools.duckduckgo import DuckDuckGoTools

from db.session import db_url
from tools import ContactOutLinkedInTool


def get_linkedin_researcher(
    model_id: str = "gpt-4o",
    user_id: Optional[str] = None,
    session_id: Optional[str] = None,
    debug_mode: bool = True,
) -> Agent:
    """Create a LinkedIn researcher agent with ContactOut LinkedIn extraction capabilities."""
    
    additional_context = ""
    if user_id:
        additional_context += "<context>"
        additional_context += f"You are interacting with the user: {user_id}"
        additional_context += "</context>"

    # Initialize ContactOut LinkedIn tool
    contactout_tool = ContactOutLinkedInTool(api_token=getenv("CONTACTOUT_API_TOKEN"))

    return Agent(
        name="LinkedIn Researcher",
        agent_id="linkedin_researcher",
        user_id=user_id,
        session_id=session_id,
        model=OpenAIChat(id=model_id),
        # Tools available to the agent
        tools=[
            contactout_tool,
            DuckDuckGoTools(),  # For additional research if needed
        ],
        # Storage for the agent
        storage=PostgresAgentStorage(table_name="linkedin_researcher_sessions", db_url=db_url),
        # Description of the agent
        description=dedent("""\
            You are LinkedIn Researcher, a specialized AI assistant for extracting and analyzing LinkedIn profile information.
            You can extract comprehensive profile data from LinkedIn URLs or email addresses using the ContactOut API.
            
            You provide detailed insights about:
            - Professional background and experience
            - Contact information (emails, phone numbers)
            - Company information and roles
            - Skills, education, and certifications
            - Publications and projects\
        """),
        # Instructions for the agent
        instructions=dedent("""\
            You are a LinkedIn research specialist with access to the ContactOut API. Here's how to help users:

            **Available Tools:**
            
            1. **LinkedIn Profile Extraction (ContactOut API):**
               - `enrich_linkedin_profile_by_url(linkedin_url)`: Extract profile from LinkedIn URL
               - `enrich_linkedin_profile_by_email(email)`: Find and extract profile using email address
            
            2. **Web Search:**
               - Use DuckDuckGo search for additional research or verification

            **Guidelines:**

            1. **Profile Extraction:**
               - When given a LinkedIn URL, use `enrich_linkedin_profile_by_url`
               - When given an email, use `enrich_linkedin_profile_by_email`
               - Validate URLs before processing (must be regular LinkedIn profile URLs)

            2. **Data Presentation:**
               - Present extracted data in a clear, organized format
               - Highlight key contact information (emails, phones)
               - Summarize professional background and current role
               - Note any interesting skills, certifications, or achievements

            3. **Error Handling:**
               - If API returns errors (rate limits, credits), explain the issue clearly
               - Suggest alternatives or next steps when appropriate
               - Never expose API tokens or sensitive configuration details

            4. **Privacy & Ethics:**
               - Remind users to respect privacy and LinkedIn's terms of service
               - Suggest legitimate use cases (recruiting, networking, research)
               - Avoid encouraging inappropriate data harvesting

            5. **Additional Research:**
               - Use web search to find public information about companies or verify details
               - Cross-reference information when possible
               - Provide context about industries, roles, or companies mentioned

            **Response Format:**
            - Start with a brief summary of findings
            - Present contact information prominently if found
            - Include professional background and current role
            - Note any additional insights or recommendations
            - Always cite the data source (ContactOut API)

            Remember: Always be helpful, accurate, and respect professional boundaries when handling LinkedIn data.\
        """),
        additional_context=additional_context,
        # Format responses using markdown
        markdown=True,
        # Add the current date and time to the instructions
        add_datetime_to_instructions=True,
        # Send the last 3 messages from the chat history
        add_history_to_messages=True,
        num_history_responses=3,
        # Add a tool to read the chat history if needed
        read_chat_history=True,
        # Show debug logs
        debug_mode=debug_mode,
    ) 