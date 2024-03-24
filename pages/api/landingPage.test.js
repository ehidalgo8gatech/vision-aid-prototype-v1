const axios = require('axios');
const apiUrl = 'http://localhost:3000/api/landingPage'; 

describe('Landing Page API Tests', () => {
    let uid = 2;
    let id;
    test('should add content successfully', async () => {
        // Mock request body
        const requestBody = {
            userId: uid,
            content: 'New content'
        };
        try {
            // Send a POST request to the API endpoint
            const response = await axios.post(`${apiUrl}`, requestBody);
            id = response.data.id // created entry with id 
            expect(response.status).toBe(200);
        } catch (error) {
            throw new Error(error);
        }
    });
    test('should read content successfully', async () => {
        // Mock request body
        var requestData = {
            id: id,
        };
        const queryString = new URLSearchParams(requestData).toString();
        try {
            // Send a GET request to the API endpoint /api/landingPage?id=2
            const response = await axios.get(`${apiUrl}?${queryString}`);
            expect(response.status).toBe(200);
            if (response.data == null ) {
                expect(response.data.id).toBe(requestData.id)
            }
        } catch (error) {
            throw new Error(error);
        }
    });
    test('should update content successfully', async () => {
        const requestBody = {
            id: id,
            content: 'New updated content'
        };
        try {
            // Send a UPDATE request to the API endpoint
            const response = await axios.patch(`${apiUrl}`, requestBody);
            expect(response.status).toBe(200);
        } catch (error) {
            throw new Error(error);
        }
    });
    test('should delete content successfully', async () => {
        // Mock request body
        var requestData = {
            id: id,
        };
        const queryString = new URLSearchParams(requestData).toString();
        try {
            // Send a DELETE request to the API endpoint /api/landingPage?id=2
            const response = await axios.delete(`${apiUrl}?${queryString}`);
            expect(response.status).toBe(200);
            if (response.data == null ) {
                expect(response.data.id).toBe(requestData.id)
            }
        } catch (error) {
            throw new Error(error);
        }
    });
});
