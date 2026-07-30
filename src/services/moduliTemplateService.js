import axios from "axios";

const API = "http://localhost:5000/api/moduli-template";

function authHeader() {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

const moduliTemplateService = {

    // ===========================
    // ELENCO TEMPLATE
    // ===========================

    async getAll() {

        const response = await axios.get(
            API,
            authHeader()
        );

        return response.data;

    },

    // ===========================
    // SINGOLO TEMPLATE
    // ===========================

    async getById(id) {

        const response = await axios.get(
            `${API}/${id}`,
            authHeader()
        );

        return response.data;

    },

    // ===========================
    // TEMPLATE PER CATEGORIA
    // ===========================

    async getByCategoria(id) {

        const response = await axios.get(
            `${API}/categoria/${id}`,
            authHeader()
        );

        return response.data;

    },

    // ===========================
    // NUOVO TEMPLATE
    // ===========================

    async create(data) {

        const response = await axios.post(
            API,
            data,
            authHeader()
        );

        return response.data;

    },

    // ===========================
    // MODIFICA
    // ===========================

    async update(id, data) {

        const response = await axios.put(
            `${API}/${id}`,
            data,
            authHeader()
        );

        return response.data;

    },

    // ===========================
    // ELIMINA
    // ===========================

    async remove(id) {

        const response = await axios.delete(
            `${API}/${id}`,
            authHeader()
        );

        return response.data;

    }

};

export default moduliTemplateService;