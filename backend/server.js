const express = require("express")
const fs = require("fs")
const path = require("path")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

const filePath = path.join(__dirname, "data.json")

const readData = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]")
  }
  return JSON.parse(fs.readFileSync(filePath))
}

const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

// GET
app.get("/izinler", (req, res) => {
  res.json(readData())
})

// POST
app.post("/izin-talep", (req, res) => {
  const { adSoyad, izinTuru, baslangic, bitis, aciklama } = req.body

  if (!adSoyad || !izinTuru || !baslangic || !bitis) {
    return res.status(400).json({ error: "Tüm alanları doldurun" })
  }

  if (new Date(baslangic) > new Date(bitis)) {
    return res.status(400).json({ error: "Başlangıç tarihi hatalı" })
  }

  const data = readData()

  const yeni = {
    id: Date.now(),
    adSoyad,
    izinTuru,
    baslangic,
    bitis,
    aciklama,
    durum: "Bekliyor"
  }

  data.push(yeni)
  writeData(data)

  res.json(yeni)
})

// PUT
app.put("/izin-durum/:id", (req, res) => {
  const data = readData()
  const izin = data.find(i => i.id == req.params.id)

  if (!izin) {
    return res.status(404).json({ error: "Bulunamadı" })
  }

  izin.durum = req.body.durum
  writeData(data)

  res.json(izin)
})

app.listen(3000, () => {
  console.log("API çalışıyor: http://localhost:3000")
})