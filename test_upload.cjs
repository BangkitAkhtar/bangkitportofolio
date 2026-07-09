const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

(async () => {
    try {
        const formData = new FormData();
        const dummyFile = Buffer.from("dummy image content");
        formData.append("file", dummyFile, "test.png");

        const response = await axios.post('https://api.bangkitakhtar.com/api/upload', formData, {
            headers: {
                ...formData.getHeaders(),
                "X-Admin-Token": "rahasia_token_panjang_sekali_123",
                "Accept": "application/json"
            }
        });
        console.log(response.data);
    } catch (err) {
        console.log(err.response ? err.response.status : err.message);
        if (err.response) {
            console.log(err.response.data);
        }
    }
})();
