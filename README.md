# 🎙️ VozCraft – Free TTS en el Navegador

**Convierte texto en voz GRATIS y en tiempo real** 🌍🔊
Genera audio de alta calidad directamente desde tu navegador, sin servidores, sin API keys y sin costos.

---

## 🚀 ¿Qué es VozCraft?

VozCraft es una aplicación web construida con React que utiliza la **Web Speech API** del navegador para convertir texto en voz de manera instantánea.

 > No depende de servicios externos.
 > No usa backend.
 > Todo el procesamiento ocurre localmente en el navegador del usuario.

---

## ✨ Características principales

* 🎙️ **100% Gratuito**
* 🌙 Modo oscuro
* 📲 Convertir en PWA
* 🎙️ Grabación del audio generado
* 🔐 Sin API keys
* ⚡ Generación en tiempo real
* 🌎 Detección automática de todas las voces disponibles en el sistema
* 🎛️ Selección dinámica de idioma y voz
* ▶️ Reproducción inmediata
* 📱 Diseño responsive
* 🖥️ Compatible con navegadores modernos (Chrome, Edge, Safari, Firefox*)

---

## 🌍 Idiomas

La aplicación detecta automáticamente todas los idiomas disponibles mediante:

```
window.speechSynthesis.getVoices()
```

Esto significa que puede soportar decenas de idiomas dependiendo del entorno del usuario, por ejemplo:

* 🇲🇽 Español (México)
* 🇪🇸 Español (España)
* 🇦🇷 Español (Argentina)
* 🇨🇴 Español (Colombia)
* 🇨🇱 Español (Chile)
* 🇺🇸 Inglés (Estados Unidos)
* 🇬🇧 Inglés (Reino Unido)
* 🇧🇷 Portugués (Brasil)
* 🇫🇷 Francés
* 🇩🇪 Alemán
* 🇮🇹 Italiano
* 🇯🇵 Japonés
* 🇰🇷 Coreano
* 🇨🇳 Chino
* 🇷🇺 Ruso
* 🇸🇦 Árabe
* 🇮🇳 Hindi
* 🇹🇷 Turco

---

## 🛠️ Tecnologías utilizadas

* ⚛️ React 18
* ⚡ Vite
* 🗣️ Web Speech API (SpeechSynthesis)
* 🎨 Tailwind CSS / CSS Vanilla
* 📱 Diseño responsive

---

## 📦 Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/tuusuario/tu-repo.git

# 2. Entrar al proyecto
cd tu-repo

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor
npm run dev
```

Luego abre:

```
http://localhost:5173
```

---

## 🧠 ¿Cómo funciona internamente?

1. El usuario escribe un texto.
2. Se cargan las voces disponibles del navegador.
3. Se selecciona una voz.
4. Se crea un `SpeechSynthesisUtterance`.
5. El navegador genera el audio en tiempo real.
6. El usuario puede editar el nombre del audio.
7. El usuario puede descargar el audio en formato "mp3" y "wav"
8. El usuario puede eliminar y/o guardar los audios en un archivo "json"
