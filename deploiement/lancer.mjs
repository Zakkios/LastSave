// Lance deployer.sh avec le bash de Git pour Windows. Sous Windows, « bash » tout court désigne
// souvent celui de WSL, un autre système où les chemins et les outils ne sont pas les mêmes.
// Le bash de Git est retrouvé à partir de git lui-même : <git>/mingw64/libexec/git-core → <git>/bin/bash.exe.
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'deployer.sh')

function bashDeGit() {
  if (process.platform !== 'win32') {
    return 'bash'
  }
  const coeurGit = execFileSync('git', ['--exec-path'], { encoding: 'utf8' }).trim()
  const bash = path.resolve(coeurGit, '..', '..', '..', 'bin', 'bash.exe')
  if (!existsSync(bash)) {
    console.error(`ÉCHEC : bash de Git introuvable (cherché ici : ${bash}).`)
    process.exit(1)
  }
  return bash
}

const resultat = spawnSync(bashDeGit(), [script, ...process.argv.slice(2)], { stdio: 'inherit' })
process.exit(resultat.status ?? 1)
