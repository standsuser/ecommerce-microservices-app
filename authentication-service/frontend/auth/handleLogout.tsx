import router from "next/router";
import { getUser } from ".";

export const handleLogout = async () => {
    const user = getUser();
    try {
        const response = await fetch('http://localhost:3000/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user }),
            credentials: 'include',
            
        });
        console.log(getUser());
        if (response.ok) {
            console.log('Logout successful');
            setTimeout(() => {
            router.push('/login');
        }, 1000); // Pause for 1 second

        }else{
            console.log('Logout failed');
            console.log(response);
        }
    } catch (error) {
        console.log(error);
    }
  };

  