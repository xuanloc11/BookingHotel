async function test() {
  const url = "http://127.0.0.1:8000/api/provinces/";
  console.log("Fetching", url);
  try {
    const res = await fetch(url);
    console.log("Status:", res.status);
    console.log("Text:", await res.text());
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
