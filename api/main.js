module.exports = (req, res) => {
  res.json({
    ok: true,
    body: req.body,
    message: "Ghello!"
  })
}