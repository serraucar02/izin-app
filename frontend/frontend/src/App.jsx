import { useState, useEffect } from "react"

export default function App() {
  const [screen, setScreen] = useState("login")
  const [role, setRole] = useState("personel")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [izinler, setIzinler] = useState([])
  const [error, setError] = useState("")

  const API = "http://localhost:3000"

  const fetchIzinler = async () => {
    const res = await fetch(API + "/izinler")
    const data = await res.json()
    setIzinler(data)
  }

  useEffect(() => {
    if (screen !== "login") fetchIzinler()
  }, [screen])

  // LOGIN
  const handleLogin = () => {
    setError("")

    if (role === "admin") {
      if (username === "admin" && password === "1234") {
        setScreen("admin")
      } else setError("Admin bilgileri yanlış")
    } else {
      if (username === "personel" && password === "1234") {
        setScreen("personel")
      } else setError("Personel bilgileri yanlış")
    }
  }

  // LOGOUT
  const logout = () => {
    setScreen("login")
    setUsername("")
    setPassword("")
    setError("")
  }

  // TARİH 
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })

  // FORM SUBMIT 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const form = new FormData(e.target)

    const body = {
      adSoyad: form.get("adSoyad"),
      izinTuru: form.get("izinTuru"),
      baslangic: form.get("baslangic"),
      bitis: form.get("bitis"),
      aciklama: form.get("aciklama"),
    }

    if (!body.adSoyad || !body.baslangic || !body.bitis) {
      setError("Lütfen tüm alanları doldurun")
      return
    }

    if (new Date(body.baslangic) > new Date(body.bitis)) {
      setError("Başlangıç tarihi bitişten sonra olamaz")
      return
    }

    const res = await fetch(API + "/izin-talep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })

    const data = await res.json()

    if (res.status !== 200) {
      setError(data.error)
      return
    }

    fetchIzinler()
    e.target.reset()
  }

  const updateStatus = async (id, durum) => {
    await fetch(API + "/izin-durum/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ durum })
    })

    fetchIzinler()
  }

  // NAVIGATIONBAR
  const Navbar = () => (
    <div className="flex justify-between items-center px-8 py-4 bg-slate-900 border-b border-slate-800">
      <img src="/pratech-logo.png" className="h-10" />
      <h1 className="text-white font-semibold text-xl">İzin Yönetim Sistemi</h1>
      <button onClick={logout} className="text-gray-400 hover:text-white">Çıkış</button>
    </div>
  )

  // LOGIN
  if (screen === "login") {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="bg-slate-800 p-8 rounded-xl w-80">
          <img src="/pratech-logo.png" className="h-10 mx-auto mb-4" />

          <select className="w-full mb-2 p-2 rounded"
            onChange={(e) => setRole(e.target.value)}>
            <option value="personel">Personel</option>
            <option value="admin">Yönetici</option>
          </select>

          <input placeholder="Kullanıcı"
            className="w-full mb-2 p-2 rounded"
            onChange={(e) => setUsername(e.target.value)} />

          <input type="password"
            placeholder="Şifre"
            className="w-full mb-2 p-2 rounded"
            onChange={(e) => setPassword(e.target.value)} />

          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

          <button onClick={handleLogin}
            className="w-full bg-blue-600 py-2 rounded text-white">
            Giriş
          </button>
        </div>
      </div>
    )
  }

  // PERSONEL
  if (screen === "personel") {
    return (
      <div className="bg-slate-900 min-h-screen text-white">
        <Navbar />

        <div className="max-w-4xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-xl space-y-3">
            <input name="adSoyad" placeholder="Ad Soyad"
              className="w-full p-2 rounded text-black" />

            <select name="izinTuru"
              className="w-full p-2 rounded text-black">
              <option>Yıllık</option>
              <option>Sağlık</option>
              <option>Mazeret</option>
            </select>

            <input type="date" name="baslangic"
              className="w-full p-2 rounded text-black" />

            <input type="date" name="bitis"
              className="w-full p-2 rounded text-black" />

            <input name="aciklama"
              placeholder="Açıklama"
              className="w-full p-2 rounded text-black" />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button className="bg-blue-600 px-4 py-2 rounded">
              Gönder
            </button>
          </form>

          <div className="mt-6 space-y-2">
            {izinler.map(i => (
              <div key={i.id} className="bg-slate-800 p-4 rounded">
                {i.adSoyad} - {i.izinTuru} <br />
                {formatDate(i.baslangic)} → {formatDate(i.bitis)} <br />
                Durum: {i.durum}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ADMIN
  if (screen === "admin") {
    return (
      <div className="bg-slate-900 min-h-screen text-white">
        <Navbar />

        <div className="max-w-4xl mx-auto p-6 space-y-3">
          {izinler.map(i => (
            <div key={i.id} className="bg-slate-800 p-4 rounded flex justify-between">
              <div>
                {i.adSoyad} - {i.izinTuru} <br />
                {formatDate(i.baslangic)} → {formatDate(i.bitis)} <br />
                Durum: {i.durum}
              </div>

              <div className="space-x-2">
                <button onClick={() => updateStatus(i.id, "Onaylandı")}
                  className="bg-green-600 px-3 py-1 rounded">
                  Onayla
                </button>

                <button onClick={() => updateStatus(i.id, "Reddedildi")}
                  className="bg-red-600 px-3 py-1 rounded">
                  Reddet
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}