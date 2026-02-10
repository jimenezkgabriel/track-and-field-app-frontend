import { getApi } from "../lib/api.js";
import { useState, useEffect } from "react";
import { useAppContext } from "../utils/AppContext.jsx";

const HundredMeterList = () => {
    const { userId, token } = useAppContext();
    const [records, setRecords] = useState([]);

    useEffect(() => {
        if (!userId) return;
        getApi(`hundred-meter/`, token)
            .then(response => {
                console.log('Records fetched successfully:', response.data);
                console.log('Fetched Records:', response);
                setRecords(response.data);
            })
            .catch(error => {
                console.error('Error fetching records:', error);
            });
    }, [userId, token]);

    return (
        <>
            <h2>Your 100m Records</h2>
            <ul>
                {records.map(record => (
                    <li key={record._id}>
                        Time: {record.sprintTime} seconds - {record.description}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default HundredMeterList;