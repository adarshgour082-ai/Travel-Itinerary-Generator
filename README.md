# AI Travel Itinerary Generator

## Project Overview
AI Travel Itinerary Generator is a web-based application that creates personalized travel plans using Generative AI and n8n automation. The system collects user inputs through a frontend form and automatically generates a structured day-wise itinerary which is delivered via email and also displayed on the website.

---

## Technologies Used
- HTML, CSS, JavaScript – Frontend Development  
- n8n – Automation Workflow  
- OpenAI GPT – Itinerary Generation  
- Gmail Node – Email Delivery  
- Webhook – System Integration  

---

## Features
- Responsive and user friendly interface  
- Client side form validation  
- AI powered itinerary generation  
- Day wise travel planning  
- Budget awareness  
- Email based delivery  
- Live result display on webpage  
- No backend framework used as per project constraints  

---

## Frontend to n8n Data Flow
1. User fills the travel details in the form  
2. JavaScript sends data to n8n webhook  
3. n8n workflow forwards data to OpenAI LLM  
4. AI generates structured travel itinerary  
5. Gmail node sends itinerary to user email  
6. Respond to Webhook node returns result to website  

---

## AI Usage Documentation

### Cursor AI Usage in Frontend
- Designing HTML structure  
- Styling with CSS  
- JavaScript validation logic  
- API integration code  
- Error handling implementation  

### AI Usage in n8n
- OpenAI LLM node for content generation  
- Prompt engineering for itinerary  
- Formatting day wise plan  
- Budget and activity suggestions  

### Human Decisions
- Form field design  
- Workflow structure  
- Prompt customization  
- UI improvements  

---

## Generated Output Includes
- Day wise travel plan  
- Suggested tourist places  
- Budget distribution  
- Travel considerations  
- Activities and tips  

---

## Limitations
- Requires internet connection  
- Depends on AI response quality  
- Email is mandatory  
- No database storage  

---

## How to Use
1. Open the website  
2. Fill all required details  
3. Submit the form  
4. Receive itinerary on email  
5. View result on webpage  

---

## Developer Details
Name: Adarsh Gour  
Course: B.Tech CSE – Data Analytics  
Project: AI Assisted Frontend + Automation
