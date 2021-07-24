export const MapUtils = {
    getCovidPoints: function(points) {
        if (!points) {  //sanity check
            return {};
        }

        const states = {
            type: "states",
        };

        const nations = {
            types: "nations",

        };

        // aggregate data by state
        for (const point of points) {
            if (Number.isNaN(point.stats.confirmed)) {
                console.error("Got dirty data", point);
                continue;
            }

            states[point.country] = states[point.country] || {}; //initialize a country key
            states[point.country][point.province] = states[point.country][point.province] || {
                confirmed: 0,
                deaths: 0,
                recovered: 0,
            }; // initialize a state/province key
            
            states[point.country][point.province].confirmed += point.stats.confirmed;
            states[point.country][point.province].deaths += point.stats.deaths;
            states[point.country][point.province].recovered += point.stats.recovered;
            states[point.country][point.province].coordinates = states[point.country][point.province].coordinates || point.coordinates;

            // homework: nation level aggregation
            nations[point.country][point.province].confirmed += point.stats.confirmed;
            nations[point.country][point.province].deaths += point.stats.deaths;
            nations[point.country][point.province].recovered += point.stats.recovered;
            nations[point.country][point.province].coordinates = nations[point.country][point.province].coordinates || point.coordinates;


            const result = {};
            let i = 1; // zoom level
            /*  1-4: nation level
                5-9: state level
                10-20: country level */
            for (; i<=4; i++) {
                result[i] = nations;
            }
            for (; i<=9; i++) {
                result[i] = states;
            }
            for (; i<=20; i++) {
                result[i] = points;
            }
            return result;
        }
    },

    isInBoundry: function (bounds, coordinates) {
        return coordinates && bounds && bounds.nw && bounds.se && 
        ((coordinates.longitude >= bounds.nw.lng && coordinates.longitude <= bounds.se.lng) || (coordinates.longitude <= bounds.nw.lng && coordinates.longitude >= bounds.se.lng))
        && ((coordinates.latitude >= bounds.se.lat && coordinates.latitude <= bounds.nw.lat) || (coordinates.latitude <= bounds.se.lat && coordinates.latitude >= bounds.nw.lat));
    },
}