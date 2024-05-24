// import router from "next/router";
// import { getUser } from ".";

// export const handleLogout = async () => {
//     const user = getUser();
    
//     try {
//         const responsegetUserbyID = await fetch(`http://localhost:3080/auth/getUserbyID/${user}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         const data = await responsegetUserbyID.json();
//         console.log(data);

//         const response = await fetch('http://localhost:3080/auth/logout', {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ data }),
//             credentials: 'include',
            
//         });
//         if (response.ok) {
//             console.log('Logout successful');
//             setTimeout(() => {
//             router.push('/login');
//         }, 1000); // Pause for 1 second

//         }else{
//             console.log('Logout failed');
//             console.log(response);
//         }
//     } catch (error) {
//         console.log("Error " , error);
//     }
//   };

import router from "next/router";
import { getUser, setVer } from ".";

export const handleLogout = async () => {
  const user = getUser();
  
  try {
    const responsegetUserbyID = await fetch(`http://localhost:3080/auth/getUserbyID/${user}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await responsegetUserbyID.json();
    console.log(data);

    const response = await fetch('http://localhost:3080/auth/logout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
      credentials: 'include',
    });

    if (response.ok) {
        console.log('Logout successful');
        localStorage.clear(); // Clear local storage
        setVer(false.toString()); // Convert boolean to string and set isAuthenticated to false
        setTimeout(() => {
            router.push('/login');
        }, 1000); // Pause for 1 second
    } else {
        console.log('Logout failed');
        console.log(response);
    }
  } catch (error) {
    console.log("Error ", error);
  }
};

  