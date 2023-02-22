async function pingBackend()
{
    try {
        const response = await fetch("http://localhost:3000");
        const text = await response.text();
        console.log(text);
    }
    catch (error){
        console.error("Error pinging back", error);
    }
}

export default pingBackend;
