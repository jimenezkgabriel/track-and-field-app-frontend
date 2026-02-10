import { postApi } from "../lib/api.js";
import { useAppContext } from "../utils/AppContext.jsx";

const LoginForm = () => {
    const { userId, setUserId, setToken } = useAppContext();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData.entries());
        console.log('Form Data:', payload);
        // Here you would typically send the data to your backend API.
        try {
            const { data } = await postApi(`users/login`, payload);
            console.log('Login successful:', data);
            setUserId(data.user._id);
            setToken(data.token);
            console.log('User ID set to:', data.user._id);
        } catch (error) {
            console.error('Login error:', error);
        }
    };
    return (
        <>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <button type="submit">Login</button>
            </form>
        </>
    );
}

export default LoginForm;