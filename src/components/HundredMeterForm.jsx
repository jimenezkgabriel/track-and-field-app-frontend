import { postApi } from "../lib/api.js";

import { useAppContext } from "../utils/AppContext.jsx";

const HundredMeterForm = () => {
    const { token } = useAppContext();
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData.entries());
        console.log('Form Data:', payload);
        // Here you would typically send the data to your backend API.
        postApi(`hundred-meter/record`, payload, token)
            .then(response => {
                console.log('Record submission successful:', response.data);
            })
            .catch(error => {
                console.error('Record submission error:', error);
            });
    };
    return (
        <>
            <h2>Submit 100m Record</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="time">Time (seconds):</label>
                <input type="number" step="0.01" id="sprintTime" name="sprintTime" required />
                <textarea name="description" id="description"></textarea>
                <button type="submit">Submit Record</button>
            </form>
        </>
    );
}

export default HundredMeterForm;