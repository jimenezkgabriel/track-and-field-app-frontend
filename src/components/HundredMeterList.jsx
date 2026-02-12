import { getApi, deleteApi, putApi } from "../lib/api.js";
import { useState, useEffect } from "react";
import { useAppContext } from "../utils/AppContext.jsx";

const HundredMeterList = () => {
    const { token } = useAppContext();
    const [records, setRecords] = useState([]);
    const [javelinTosses, setJavelinTosses] = useState([]);

    useEffect(() => {
        if (!token) return;
        getApi(`hundred-meter/`, token)
            .then(response => {
                console.log('Records fetched successfully:', response.data);
                console.log('Fetched Records:', response);
                setRecords(response.data);
            })
            .catch(error => {
                console.error('Error fetching records:', error);
            });
        getApi(`javelin-toss/`, token)
            .then(response => {
                console.log('Javelin tosses fetched successfully:', response.data);
                console.log('Fetched Javelin Tosses:', response);
                setJavelinTosses(response.data);
            })
            .catch(error => {
                console.error('Error fetching javelin tosses:', error);
            });
    }, [token]);

    const handleDelete = (recordId) => {
        deleteApi(`hundred-meter/delete/${recordId}`, token)
            .then(() => {
                setRecords(records.filter(record => record._id !== recordId));
            })
            .catch(error => {
                console.error('Error deleting record:', error);
            });
    };

    const handleEdit = (recordId) => {
        // Implement edit functionality here
        putApi(`hundred-meter/update/${recordId}`, { sprintTime: 9.58, description: "Updated record" }, token)
            .then(response => {
                console.log('Record updated successfully:', response.data);
                setRecords(records.map(record => record._id === recordId ? response.data : record));
            })
            .catch(error => {
                console.error('Error updating record:', error);
            });
    };

    return (
        <>
            <h2>Your 100m Records</h2>
            <ul>
                {records.map(record => (
                    <li key={record._id}>
                        Time: {record.sprintTime} seconds - {record.description} <span><button onClick={() => handleDelete(record._id)}>Delete</button></span><span><button onClick={() => handleEdit(record._id)}>Edit</button></span>
                    </li>
                ))}
            </ul>
            <h2>Your Javelin Toss Records</h2>
            <ul>
                {javelinTosses.map(toss => (
                    <li key={toss._id}>
                        Distance: {toss.tossDistance} meters - {toss.description}
                    </li>
                ))}
            </ul>
        </>
    );
}

export default HundredMeterList;