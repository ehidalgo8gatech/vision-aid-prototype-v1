const apiUrl = 'http://localhost:3000/api/landingPage'; 
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Landing Page API Tests', () => {
    let id;
    beforeAll(async () => {
        var requestData = {
            id: id,
            action: "clear"
        };
        const queryString = new URLSearchParams(requestData).toString();
        // Send a DELETE request to the API endpoint /api/landingPage?id=2
        const response = await fetch(`${apiUrl}?${queryString}`, { method: "DELETE" });
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.id).toBe(id);
    });

    test('should add content successfully', async () => {
        // Mock request body
        const requestBody = {
            content: 'New content',
            title: "Post 999"
        };
      
        // Send a POST request to the API endpoint
        const response = await fetch(`${apiUrl}`, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.content).toBe(requestBody.content);
        expect(responseBody.id).toBeDefined();
        id = responseBody.id;
    });
    test('should read content successfully', async () => {
        // Mock request body
        var requestData = {
            id: id,
        };
        const queryString = new URLSearchParams(requestData).toString();
        
        // Send a GET request to the API endpoint /api/landingPage?id=2
        const response = await fetch(`${apiUrl}?${queryString}`);
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.id).toBe(id);
    });
    test('should update content successfully', async () => {
        const requestBody = {
            id: id,
            content: 'New updated content'
        };
        // Send a UPDATE request to the API endpoint
        const response = await fetch(`${apiUrl}`, {
          method: "PATCH",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        expect(response.status).toBe(200);
    });
    test('should read all content successfully', async () => {
        var requestData = {
        };
        const queryString = new URLSearchParams(requestData).toString();
        const response = await fetch(`${apiUrl}?${queryString}`);
        const responseBody = await response.json();
        expect(response.status).toBe(200);
        expect(responseBody.length).toBe(1)
        expect(responseBody[0].content).toBe("New updated content")
        // const responseBody = await response.json();
    });
    test('should delete content successfully', async () => {
        // Mock request body
        var requestData = {
            id: id,
        };
        const queryString = new URLSearchParams(requestData).toString();
        // Send a DELETE request to the API endpoint /api/landingPage?id=2
        const response = await fetch(`${apiUrl}?${queryString}`, { method: "DELETE" });
        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.id).toBe(id);
    });

});
