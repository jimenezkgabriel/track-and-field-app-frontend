import { postApi } from "../lib/api";
const RegisterForm = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log('Form Data:', data);
        // Here you would typically send the data to your backend API.
        postApi(`users/register`, data)
            .then(response => {
                console.log('Registration successful:', response.data);
            })
            .catch(error => {
                console.error('Registration error:', error);
            });
    }
    return (
        <>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <button type="submit">Register</button>
            </form>
        </>
    )
}

export default RegisterForm