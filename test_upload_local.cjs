const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

(async () => {
    try {
        const dummyFile = fs.readFileSync('public/favicon.webp');
        
        const formData = new FormData();
        formData.append("file", dummyFile, "favicon.webp");

        const response = await axios.post('https://api.bangkitakhtar.com/api/upload', formData, {
            headers: {
                ...formData.getHeaders(),
                "X-Admin-Token": "rahasia_token_panjang_sekali_123",
                "Accept": "application/json"
            }
        });
        console.log(response.status, response.data);
    } catch (err) {
        console.log(err.response ? err.response.status : err.message);
        if (err.response) {
            console.log(err.response.data);
        }
    }
})();
