const axios = require('axios');
const apiUrl = 'http://localhost:3000/api/landingPage'; 

describe('UserContent handler', () => {
    let uid = 2;
    test('should add content successfully', async () => {
        // Mock request body
        const requestBody = {
            userId: uid,
            content: 'New content'
        };
        try {
            // Send a POST request to the API endpoint
            const response = await axios.post(`${apiUrl}`, requestBody);
            expect(response.status).toBe(200);
        } catch (error) {
            throw new Error(error);;
        }
    });
    test('should read content successfully', async () => {
        // Mock request body
        var requestData = {
            userId: uid,
        };
        const queryString = new URLSearchParams(requestData).toString();
        try {
            // Send a GET request to the API endpoint /api/landingPage?userId=2
            const response = await axios.get(`${apiUrl}?${queryString}`);
            expect(response.status).toBe(200);
            if (response.data == null ) {
                expect(response.data.userId).toBe(requestData.userId)
            }
        } catch (error) {
            throw new Error(error);
        }
    });
    test('should update content successfully', async () => {
        const requestBody = {
            userId: uid,
            content: 'New updated content'
        };
        try {
            // Send a UPDATE request to the API endpoint
            const response = await axios.patch(`${apiUrl}`, requestBody);
            expect(response.status).toBe(200);
        } catch (error) {
            throw new Error(error);;
        }
    });
    test('should delete content successfully', async () => {
        // Mock request body
        var requestData = {
            userId: uid,
        };
        const queryString = new URLSearchParams(requestData).toString();
        try {
            // Send a DELETE request to the API endpoint /api/landingPage?userId=2
            const response = await axios.delete(`${apiUrl}?${queryString}`);
            expect(response.status).toBe(200);
            if (response.data == null ) {
                expect(response.data.userId).toBe(requestData.userId)
            }
        } catch (error) {
            throw new Error(error);;
        }
    });
});
