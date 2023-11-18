import axios from 'axios';

class PrestoAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.token = null;
        this.email = null;
        this.password = null;
    }

    isLoggedIn() {
        return localStorage.getItem('user_email') !== null && localStorage.getItem('user_password') !== null;
    }

    async loginIfNeeded(forced) {
        forced = forced || false;
        if (!this.token || forced) {
            const storedEmail = localStorage.getItem('user_email');
            const storedPassword = localStorage.getItem('user_password');

            if (storedEmail && storedPassword) {
                this.email = storedEmail;
                this.password = storedPassword;

                const loginData = { email: this.email, password: this.password };
                try {
                    const response = await axios.post(`${this.baseUrl}/login`, loginData);
                    this.token = response.data.token;
                } catch (error) {
                    // Error handling
                }
            }
        }
    }

    async register(data) {
        try {
            await axios.post(`${this.baseUrl}/register`, data);
            this.email = data.email;
            this.password = data.password;
            await this.login(this.email, this.password);
            return true;
        } catch (error) {
            return false;
        }
    }

    async login(email, password) {
        const loginData = { email, password };
        try {
            const response = await axios.post(`${this.baseUrl}/login`, loginData);
            this.token = response.data.token;
            this.email = email;
            this.password = password;
            localStorage.setItem('user_email', email);
            localStorage.setItem('user_password', password);
            return true;
        } catch (error) {
            // Error handling
            return false;
        }
    }

    async editEmail(data) {
        await this.loginIfNeeded();
        try {
            await axios.patch(`${this.baseUrl}/user/editemail`, data, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            this.email = data.email;
            await this.loginIfNeeded(true);
            return true;
        } catch (error) {
            return false;
        }
    }

    async editPhone(data) {
        await this.loginIfNeeded();
        try {
            await axios.patch(`${this.baseUrl}/user/editphone`, data, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async createOrder(data) {
        await this.loginIfNeeded();
        try {
            await axios.post(`${this.baseUrl}/order`, data, {
                headers: { Authorization: `Bearer ${this.token}` },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async deleteAccount(data) {
        await this.loginIfNeeded();
        try {
            await axios.delete(`${this.baseUrl}/user/deleteaccount`, {
                data,
                headers: { Authorization: `Bearer ${this.token}` },
            });
            this.token = null;
            this.email = null;
            this.password = null;
            return true;
        } catch (error) {
            return false;
        }
    }

    async getRestaurants() {
        try {
            const response = await axios.get(`${this.baseUrl}/restaurants`);
            return response.data;
        } catch (error) {
            return [];
        }
    }

    async getRestaurantById(id) {
        try {
            const response = await axios.get(`${this.baseUrl}/restaurant/id/${id}`);
            return response.data;
        } catch (error) {
            return null;
        }
    }

    async getRestaurantByTitle(title) {
        try {
            const response = await axios.get(`${this.baseUrl}/restaurant/${title}`);
            return response.data;
        } catch (error) {
            return null;
        }
    }

    async getTopRestaurants(quantity) {
        try {
            const response = await axios.get(`${this.baseUrl}/restaurants/quantity/${quantity}`);
            return response.data;
        } catch (error) {
            return [];
        }
    }

    async getRestaurantsByPageAndQuantity(page, quantity) {
        try {
            const response = await axios.get(`${this.baseUrl}/restaurants/quantity/${quantity}/page/${page}`);
            return response.data;
        } catch (error) {
            return [];
        }
    }

    async searchRestaurants(query) {
        try {
            const response = await axios.get(`${this.baseUrl}/search/${query}`);
            return response.data;
        } catch (error) {
            return [];
        }
    }

    async getRestaurantsByTag(tag) {
        try {
            const response = await axios.get(`${this.baseUrl}/tag/${tag}`);
            return response.data;
        } catch (error) {
            return [];
        }
    }

    async getImage(name) {
        try {
            const response = await axios.get(`${this.baseUrl}/image/${name}`, { responseType: 'arraybuffer' });
            const base64Image = btoa(
                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            return `data:image/jpeg;base64,${base64Image}`;
        } catch (error) {
            return null;
        }
    }
}

export const API = new PrestoAPI('https://api.prestoreserve.ge');
