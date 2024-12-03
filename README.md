## What is CareerAI
The careerAI project is designed to meet the diverse needs of job seekers at various 
stages of their career journey. By focusing on user-centric features, the project aims 
to provide a comprehensive toolkit that empowers individuals to present themselves 
more effectively to potential employers. The user requirements are divided into three 
main categories, each addressing a critical aspect of the job application process: 
- resume creation
- information extraction
- interview preparation. 

## Design and Implementation
CareerAI employs a microservices architecture to ensure scalability, maintainability, and 
flexibility. The system is divided into three main components, each functioning as an 
independent service: 
1. Resume Builder Service 
2. Resume Parser Service 
3. Mock Interview Service 
   
These services communicate through RESTful APIs, with a central AWS API Gateway 
managing requests and Single Sign On provider, Google Oauth, for user authentication.

## Resume Builder
![image](https://github.com/user-attachments/assets/76490eda-c1b7-46be-8a73-f32dd54c440c)

## Parser
![image](https://github.com/user-attachments/assets/29755263-7d28-494f-8a91-096fd322b8ea)
## Interview
![image](https://github.com/user-attachments/assets/dacce7a0-bb4f-4752-91bb-d874f4ddc432)

