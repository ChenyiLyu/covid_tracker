import axios from "axios"

export const MapService = {
    getUSCovidData: function() {
        return axios.get("https://corona.lmao.ninja/v2/jhucsse/counties");
    }
}