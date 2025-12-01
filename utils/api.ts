export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;


export async function api(path: string) {
  const res = await fetch(API_BASE + path);
  console.log('res',res);

  return res.json();
}

export async function apiPost(path: string, data: any) {
   const token = localStorage.getItem("token");
   console.log('token',token);
   
  const res = await fetch(`${API_BASE}${path}`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
           },
          body: JSON.stringify(data),
        });
  
  console.log('res',res);
  if (!res.ok) {
    throw new Error(`Status: ${res.status}`);
  }
  return res.json();
}

export async function apiGet(path: string) {
 const token = localStorage.getItem("token");
   console.log('token',token);
   
  const res = await fetch(`${API_BASE}${path}`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
           },
       });
  
  console.log('res',res);
  if (!res.ok) {
    throw new Error(`Status: ${res.status}`);
  }
  return res.json();
}
