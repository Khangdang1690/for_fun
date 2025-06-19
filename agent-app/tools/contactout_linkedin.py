"""ContactOut LinkedIn Profile API tool for extracting LinkedIn profile information."""

from os import getenv
from typing import Dict, Optional
from urllib.parse import urlparse

import requests
from agno.tools import Toolkit
from agno.utils.log import logger


class ContactOutLinkedInTool(Toolkit):
    """A tool for extracting LinkedIn profile information using ContactOut API."""

    def __init__(self, api_token: Optional[str] = None):
        super().__init__(name="contactout_linkedin_tool")
        
        self.api_token = api_token or getenv("CONTACTOUT_API_TOKEN")
        self.base_url = "https://api.contactout.com/v1"
        
        # Register tool functions
        self.register(self.enrich_linkedin_profile_by_url)
        self.register(self.enrich_linkedin_profile_by_email)

    def _get_headers(self) -> Dict[str, str]:
        """Get headers for API requests."""
        return {
            "authorization": "basic",
            "token": self.api_token,
            "Content-Type": "application/json"
        }

    def _validate_linkedin_url(self, url: str) -> bool:
        """Validate if the URL is a proper LinkedIn profile URL."""
        try:
            parsed = urlparse(url)
            return (
                parsed.netloc in ["www.linkedin.com", "linkedin.com"] and
                "/in/" in parsed.path and
                "sales-navigator" not in url.lower() and
                "talent" not in url.lower() and
                "recruiter" not in url.lower()
            )
        except Exception:
            return False

    def enrich_linkedin_profile_by_url(self, linkedin_url: str) -> Dict:
        """Extract profile information from a LinkedIn profile URL.
        
        Args:
            linkedin_url (str): LinkedIn profile URL (regular URLs only, not Sales Navigator)
            
        Returns:
            Dict: Complete LinkedIn profile information including contact details
        """
        if not self.api_token:
            return {
                "error": "ContactOut API token not configured. Please set CONTACTOUT_API_TOKEN environment variable."
            }
        
        # Validate LinkedIn URL
        if not self._validate_linkedin_url(linkedin_url):
            return {
                "error": "Invalid LinkedIn URL. Please provide a regular LinkedIn profile URL (not Sales Navigator, Talent, or Recruiter URLs)."
            }
        
        try:
            url = f"{self.base_url}/linkedin/enrich"
            params = {"profile": linkedin_url}
            headers = self._get_headers()
            
            response = requests.get(url, params=params, headers=headers, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("status_code") == 200 and "profile" in data:
                profile = data["profile"]
                
                # Structure the response for better readability
                return {
                    "success": True,
                    "basic_info": {
                        "full_name": profile.get("full_name"),
                        "headline": profile.get("headline"),
                        "industry": profile.get("industry"),
                        "location": profile.get("location"),
                        "country": profile.get("country"),
                        "summary": profile.get("summary")
                    },
                    "contact_info": {
                        "emails": profile.get("email", []),
                        "work_emails": profile.get("work_email", []),
                        "personal_emails": profile.get("personal_email", []),
                        "phones": profile.get("phone", []),
                        "github": profile.get("github", []),
                        "twitter": profile.get("twitter", [])
                    },
                    "company": profile.get("company", {}),
                    "experience": profile.get("experience", []),
                    "education": profile.get("education", []),
                    "skills": profile.get("skills", []),
                    "languages": profile.get("languages", []),
                    "certifications": profile.get("certifications", []),
                    "publications": profile.get("publications", []),
                    "projects": profile.get("projects", []),
                    "linkedin_url": profile.get("url")
                }
            else:
                return {
                    "error": f"API returned status code {data.get('status_code', 'unknown')}",
                    "details": data
                }
                
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 403:
                return {"error": "Out of credits or no access to endpoint. Please check your ContactOut subscription."}
            elif e.response.status_code == 429:
                retry_after = e.response.headers.get("retry-after", "unknown")
                return {"error": f"Rate limit reached. Retry after {retry_after} seconds."}
            else:
                logger.error(f"HTTP error in ContactOut API: {e}")
                return {"error": f"HTTP error: {e.response.status_code}"}
        except requests.RequestException as e:
            logger.error(f"Error calling ContactOut API: {e}")
            return {"error": f"Failed to call ContactOut API: {str(e)}"}
        except Exception as e:
            logger.error(f"Unexpected error in ContactOut LinkedIn tool: {e}")
            return {"error": f"Unexpected error: {str(e)}"}

    def enrich_linkedin_profile_by_email(self, email: str) -> Dict:
        """Extract LinkedIn profile information using an email address.
        
        Args:
            email (str): Email address to find LinkedIn profile for
            
        Returns:
            Dict: LinkedIn profile information if found
        """
        if not self.api_token:
            return {
                "error": "ContactOut API token not configured. Please set CONTACTOUT_API_TOKEN environment variable."
            }
        
        # Basic email validation
        if "@" not in email or "." not in email:
            return {"error": "Invalid email format provided."}
        
        try:
            url = f"{self.base_url}/linkedin/enrich"
            params = {"email": email}
            headers = self._get_headers()
            
            response = requests.get(url, params=params, headers=headers, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("status_code") == 200 and "profile" in data:
                profile = data["profile"]
                
                # Structure the response for better readability
                return {
                    "success": True,
                    "basic_info": {
                        "full_name": profile.get("full_name"),
                        "headline": profile.get("headline"),
                        "industry": profile.get("industry"),
                        "location": profile.get("location"),
                        "country": profile.get("country"),
                        "summary": profile.get("summary")
                    },
                    "contact_info": {
                        "emails": profile.get("email", []),
                        "work_emails": profile.get("work_email", []),
                        "personal_emails": profile.get("personal_email", []),
                        "phones": profile.get("phone", []),
                        "github": profile.get("github", []),
                        "twitter": profile.get("twitter", [])
                    },
                    "company": profile.get("company", {}),
                    "experience": profile.get("experience", []),
                    "education": profile.get("education", []),
                    "skills": profile.get("skills", []),
                    "languages": profile.get("languages", []),
                    "certifications": profile.get("certifications", []),
                    "publications": profile.get("publications", []),
                    "projects": profile.get("projects", []),
                    "linkedin_url": profile.get("url"),
                    "search_email": email
                }
            else:
                return {
                    "error": f"No LinkedIn profile found for email: {email}",
                    "status_code": data.get('status_code', 'unknown')
                }
                
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 403:
                return {"error": "Out of credits or no access to endpoint. Please check your ContactOut subscription."}
            elif e.response.status_code == 429:
                retry_after = e.response.headers.get("retry-after", "unknown")
                return {"error": f"Rate limit reached. Retry after {retry_after} seconds."}
            else:
                logger.error(f"HTTP error in ContactOut API: {e}")
                return {"error": f"HTTP error: {e.response.status_code}"}
        except requests.RequestException as e:
            logger.error(f"Error calling ContactOut API: {e}")
            return {"error": f"Failed to call ContactOut API: {str(e)}"}
        except Exception as e:
            logger.error(f"Unexpected error in ContactOut LinkedIn tool: {e}")
            return {"error": f"Unexpected error: {str(e)}"} 