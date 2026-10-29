import react from '@vitejs/plugin-react'
import { zipSync } from 'fflate'
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'

const PUBLIC_DIR = path.resolve('public')

// A report is any top-level folder in public/ that has an index.html.
const reportDirs = () =>
  fs.readdirSync(PUBLIC_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && fs.existsSync(path.join(PUBLIC_DIR, d.name, 'index.html')))
    .map(d => d.name)

// Zip a whole report folder, keeping the folder name as the root inside the archive.
function zipReport(name) {
  const files = {}
  const walk = (dir, rel) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name)
      const key = `${rel}/${entry.name}`
      if (entry.isDirectory()) walk(abs, key)
      else files[key] = fs.readFileSync(abs)
    }
  }
  walk(path.join(PUBLIC_DIR, name), name)
  return zipSync(files, { level: 6 })
}

// Serves /<report>.zip for the card's "Download Report" option: generated on the
// fly in dev, written next to the report folders in the production build.
function reportZips() {
  let outDir, isBuild
  return {
    name: 'report-zips',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
      isBuild = config.command === 'build'
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const match = /^\/([^/]+)\.zip$/.exec(decodeURIComponent(req.url.split('?')[0]))
        if (!match || !reportDirs().includes(match[1])) return next()
        const zip = zipReport(match[1])
        res.setHeader('Content-Type', 'application/zip')
        res.setHeader('Content-Length', zip.length)
        res.end(Buffer.from(zip))
      })
    },
    closeBundle() {
      // Vite also calls this when the dev server shuts down.
      if (!isBuild) return
      for (const name of reportDirs()) {
        fs.writeFileSync(path.join(outDir, `${name}.zip`), zipReport(name))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), reportZips()],
})
