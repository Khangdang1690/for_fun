# ContactOut LinkedIn API Tool

This tool enables LinkedIn profile extraction using the [ContactOut API](https://api.contactout.com/#enrich-linkedin-profile-response-parameters).

## 🚀 Quick Setup

### 1. Get ContactOut API Access

1. Visit [ContactOut API](https://api.contactout.com/#enrich-linkedin-profile-response-parameters)
2. Book a meeting to request an API key
3. Get your API token from ContactOut

### 2. Configure Environment

Add your ContactOut API token to your environment:

```bash
export CONTACTOUT_API_TOKEN="your_api_token_here"
```

Or add it to your `.env` file:
```
CONTACTOUT_API_TOKEN=your_api_token_here
```

### 3. Usage in Agents

The tool is automatically available in the LinkedIn Researcher agent:

```python
from agents.linkedin_researcher import get_linkedin_researcher

# Create the agent
researcher = get_linkedin_researcher(user_id="your_user")

# Use the agent
response = await researcher.arun("Extract profile info from https://www.linkedin.com/in/example-person")
```

## 🛠️ Available Functions

### `enrich_linkedin_profile_by_url(linkedin_url)`

Extract complete profile information from a LinkedIn URL.

**Parameters:**
- `linkedin_url` (str): Regular LinkedIn profile URL (not Sales Navigator/Talent/Recruiter)

**Returns:** Dictionary with structured profile data including:
- Basic info (name, headline, location)
- Contact information (emails, phones, social profiles)
- Company details
- Work experience
- Education
- Skills and certifications

### `enrich_linkedin_profile_by_email(email)`

Find and extract LinkedIn profile using an email address.

**Parameters:**
- `email` (str): Email address to search for

**Returns:** Same structured profile data as above

## 📋 Supported LinkedIn URLs

✅ **Supported:**
- `https://www.linkedin.com/in/username`
- `https://linkedin.com/in/username`

❌ **Not Supported:**
- Sales Navigator URLs
- Talent/Recruiter URLs
- Company pages
- Group pages

## 💰 API Costs

Based on [ContactOut pricing](https://api.contactout.com/#enrich-linkedin-profile-response-parameters):

- **Profile enrichment**: Consumes credits based on your ContactOut plan
- **Rate limits**: 1000 requests per minute for profile enrichment
- **Contact extraction**: Additional costs may apply for phone/email data

## ⚠️ Error Handling

The tool handles common API errors:

- **403 Forbidden**: Out of credits or no endpoint access
- **429 Rate Limited**: Too many requests (includes retry-after header)
- **Invalid URLs**: Validates LinkedIn URL format
- **Network errors**: Timeout and connection issues

## 🔒 Privacy & Ethics

**Important Guidelines:**

1. **Respect Privacy**: Only extract public LinkedIn data
2. **Terms of Service**: Comply with LinkedIn's and ContactOut's terms
3. **Legitimate Use**: Use for recruiting, networking, or research purposes
4. **Data Protection**: Handle extracted data responsibly
5. **Rate Limits**: Respect API rate limits to avoid service disruption

## 🧪 Testing

Test your setup:

```python
from tools import ContactOutLinkedInTool

# Initialize tool
tool = ContactOutLinkedInTool()

# Test with a LinkedIn URL
result = tool.enrich_linkedin_profile_by_url("https://www.linkedin.com/in/example")
print(result)
```

## 📚 Resources

- [ContactOut API Documentation](https://api.contactout.com/)
- [LinkedIn Profile URL Format](https://www.linkedin.com/help/linkedin/answer/a542685)
- [ContactOut Pricing](https://contactout.com/pricing)

---

**Need Help?** Check the ContactOut API documentation or contact their support team for API-related issues. 