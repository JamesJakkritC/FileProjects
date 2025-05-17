export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name } = req.body;

    try {
      const response = await fetch(
        `https://script.google.com/macros/s/1D1VSEvQqcMHvHviipfJHI6pe1p2XOp2KX0sh7ZREDic/exec?name=${encodeURIComponent(name)}`
      );
      const text = await response.text();
      res.status(200).send(text);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error forwarding request");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
