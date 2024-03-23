const axios = require('axios');
const apiUrl = 'http://localhost:3000/api/landingPage'; 

describe('UserContent handler', () => {
    test('should add content successfully', async () => {
        // Mock request body
        const requestBody = {
            userId: 2,
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
        var requestData = {
            userId: 2,
        };
        const queryString = new URLSearchParams(requestData).toString();
        try {
            // Send a GET request to the API endpoint /api/landingPage?userId=2
            const response = await axios.get(`${apiUrl}?${queryString}`);
            // console.log("reponse.data got it - ", response)
            if (response.data == null ) {
                expect(response.data.userId).toBe(requestData.userId)
            } else {
                expect(response.data.userId).toBe(requestData.userId)
            }
            expect(response.status).toBe(200);
        } catch (error) {
            throw new Error(error);
        }
    });
    test('should update content successfully', async () => {
        // Mock request body
        const requestBody = {
            userId: 2,
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
        var requestData = {
            userId: 2,
        };
        const queryString = new URLSearchParams(requestData).toString();
        try {
            // Send a DELETE request to the API endpoint
            const response = await axios.delete(`${apiUrl}?${queryString}`);
            if (response.data == null ) {
                expect(response.data.userId).toBe(requestData.userId)
            } else {
                expect(response.data.userId).toBe(requestData.userId)
            }
        } catch (error) {
            throw new Error(error);;
        }
    });


});
