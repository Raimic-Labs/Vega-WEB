'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import JSZip from 'jszip'
import CopyButton from '@/components/ui/CopyButton'
import styles from './build.module.css'

interface GeneratedFile {
  name: string
  language: string
  content: string
}

const DEFAULT_PROJECT_FILES: GeneratedFile[] = [
  {
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vega Built SaaS App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div className="container">
    <header className="header">
      <div className="logo">⟡ Vega SaaS</div>
      <button id="cta-btn" className="btn">Get Started</button>
    </header>

    <main className="hero">
      <h1>Code at the <span className="accent">speed of stars</span></h1>
      <p>Built autonomously by Vega CLI using NVIDIA NIM & Kimi K2.6</p>
      <div id="status" className="status-box">Status: Ready</div>
    </main>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
  },
  {
    name: 'styles.css',
    language: 'css',
    content: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: #0A0A0F;
  color: #FFFFFF;
  font-family: system-ui, -apple-system, sans-serif;
  min-height: 100vh;
}

.container { max-width: 1000px; margin: 0 auto; padding: 2rem; }
.header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.logo { font-size: 1.5rem; font-weight: bold; color: #00FFFF; }

.btn {
  background: #00FFFF;
  color: #0A0A0F;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
}
.btn:hover { background: #67F5F5; }

.hero { text-align: center; margin-top: 4rem; }
.hero h1 { font-size: 3rem; margin-bottom: 1rem; }
.accent { color: #00FFFF; text-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
.hero p { color: #A0A0B8; font-size: 1.2rem; }

.status-box {
  margin-top: 2rem;
  display: inline-block;
  padding: 8px 16px;
  background: rgba(0, 255, 255, 0.08);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 9999px;
  color: #00FFFF;
  font-family: monospace;
}`,
  },
  {
    name: 'app.js',
    language: 'javascript',
    content: `document.getElementById('cta-btn').addEventListener('click', () => {
  const statusEl = document.getElementById('status');
  statusEl.textContent = 'Status: Launching Workspace...';
  statusEl.style.borderColor = '#28C840';
  statusEl.style.color = '#28C840';
  setTimeout(() => {
    alert('Welcome to your Vega generated project!');
  }, 300);
});`,
  },
  {
    name: 'README.md',
    language: 'markdown',
    content: `# Vega Generated Project

This project was built automatically using **Vega CLI ProjectBuilder**.

## 🚀 How to Run

1. Open \`index.html\` in your browser
2. Or run a local dev server:
   \`\`\`bash
   npx serve .
   \`\`\`

Powered by Raimic Labs.`,
  },
]

export default function BuildPage() {
  const [prompt, setPrompt] = useState('build me a modern SaaS landing page with responsive design')
  const [isBuilding, setIsBuilding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState('')
  const [files, setFiles] = useState<GeneratedFile[]>(DEFAULT_PROJECT_FILES)
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('preview')

  const activeFile = files[activeFileIndex] || files[0]

  // Construct iframe srcDoc for live HTML preview
  const livePreviewHtml = useMemo(() => {
    const htmlFile = files.find((f) => f.name.endsWith('.html'))?.content || ''
    const cssFile = files.find((f) => f.name.endsWith('.css'))?.content || ''
    const jsFile = files.find((f) => f.name.endsWith('.js'))?.content || ''

    if (!htmlFile) return '<html><body><h3 style="color:#666;text-align:center;margin-top:20%;">No HTML file generated yet</h3></body></html>'

    // Inject inline CSS & JS for single iframe srcDoc
    let combined = htmlFile
    if (cssFile) {
      combined = combined.replace('</head>', `<style>${cssFile}</style></head>`)
    }
    if (jsFile) {
      combined = combined.replace('</body>', `<script>${jsFile}</script></body>`)
    }

    return combined
  }, [files])

  // Handle Project Generation Simulation / API Build
  const handleBuild = async () => {
    if (!prompt.trim() || isBuilding) return

    setIsBuilding(true)
    setProgress(10)
    setProgressText('Analyzing project requirements...')

    setTimeout(() => {
      setProgress(40)
      setProgressText('Planning stack & file architecture...')
    }, 800)

    setTimeout(() => {
      setProgress(75)
      setProgressText('Generating index.html, styles.css, app.js...')
    }, 1800)

    setTimeout(() => {
      setProgress(100)
      setProgressText('Build Complete!')
      setIsBuilding(false)
    }, 2800)
  }

  // Handle ZIP Download
  const handleDownloadZip = async () => {
    const zip = new JSZip()
    files.forEach((f) => zip.file(f.name, f.content))

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vega-project.zip'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandIcon}>⟡</span>
          <span>Vega Project Builder</span>
        </Link>

        <div className={styles.headerActions}>
          <button
            onClick={handleDownloadZip}
            disabled={files.length === 0}
            className={styles.downloadBtn}
            id="download-zip-btn"
          >
            <span>📦</span> Download ZIP
          </button>
        </div>
      </header>

      {/* Main Split View */}
      <div className={styles.splitView}>
        {/* Left Panel */}
        <aside className={styles.leftPanel}>
          <div className={styles.panelTitle}>
            <span>✦</span>
            <span>Describe Your Project</span>
          </div>

          <div className={styles.promptBox}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. build a REST API in Python with FastAPI, or a portfolio web app"
              className={styles.textarea}
              id="build-prompt-input"
            />

            <div className={styles.presetsRow}>
              <span
                className={styles.presetChip}
                onClick={() => setPrompt('build a modern SaaS landing page with dark mode')}
              >
                🌐 SaaS Landing Page
              </span>
              <span
                className={styles.presetChip}
                onClick={() => setPrompt('build a REST API with Python FastAPI & SQLite')}
              >
                🚀 Python REST API
              </span>
              <span
                className={styles.presetChip}
                onClick={() => setPrompt('build a React Kanban task manager app')}
              >
                📋 Task Manager App
              </span>
            </div>

            <button
              onClick={handleBuild}
              disabled={isBuilding || !prompt.trim()}
              className={styles.buildBtn}
              id="start-build-btn"
            >
              {isBuilding ? 'Generating Project...' : '⟡ Generate Full Project'}
            </button>
          </div>

          {/* Progress Bar */}
          {isBuilding && (
            <div className={styles.progressContainer}>
              <div className={styles.progressLabel}>
                <span>{progressText}</span>
                <span>{progress}%</span>
              </div>
              <div className={styles.track}>
                <div className={styles.fill} style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* File Tree */}
          <div className={styles.fileTreeSection}>
            <div className={styles.panelTitle}>
              <span>📁</span> Generated Files ({files.length})
            </div>
            <div className={styles.treeList}>
              {files.map((file, index) => (
                <button
                  key={file.name}
                  onClick={() => {
                    setActiveFileIndex(index)
                    if (file.name.endsWith('.html') || file.name.endsWith('.css') || file.name.endsWith('.js')) {
                      // Allow tab switching
                    }
                  }}
                  className={`${styles.treeFileItem} ${
                    index === activeFileIndex ? styles.treeFileItemActive : ''
                  }`}
                >
                  <span>
                    {file.name.endsWith('.html')
                      ? '🌐'
                      : file.name.endsWith('.css')
                      ? '🎨'
                      : file.name.endsWith('.js')
                      ? '📜'
                      : '📝'}
                  </span>
                  <span>{file.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Panel */}
        <main className={styles.rightPanel}>
          {/* Tab Bar */}
          <div className={styles.tabBar}>
            <button
              onClick={() => setActiveTab('preview')}
              className={`${styles.tabBtn} ${activeTab === 'preview' ? styles.tabBtnActive : ''}`}
            >
              👁 Live Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`${styles.tabBtn} ${activeTab === 'code' ? styles.tabBtnActive : ''}`}
            >
              📄 Code Viewer ({activeFile?.name})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'code' ? (
            <div className={styles.editorContainer}>
              <div className={styles.fileHeader}>
                <span>{activeFile?.name}</span>
                <CopyButton text={activeFile?.content || ''} />
              </div>
              <pre className={styles.codeArea}>
                <code>{activeFile?.content}</code>
              </pre>
            </div>
          ) : (
            <iframe
              srcDoc={livePreviewHtml}
              title="Vega Project Live Preview"
              className={styles.previewFrame}
            />
          )}
        </main>
      </div>
    </div>
  )
}
