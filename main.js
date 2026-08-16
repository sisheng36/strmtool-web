const themeToggle = document.querySelector('.theme-toggle')
const metaThemeColor = document.querySelector('#meta-theme-color')

function isDarkTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark'
}

function syncThemeChrome() {
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', isDarkTheme() ? '#0b1020' : '#172554')
  }
  if (themeToggle) {
    themeToggle.setAttribute(
      'aria-label',
      isDarkTheme() ? '切换浅色模式' : '切换深色模式',
    )
    themeToggle.setAttribute(
      'title',
      isDarkTheme() ? '切换浅色模式' : '切换深色模式',
    )
  }
}

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  try {
    localStorage.setItem('strm-theme', dark ? 'dark' : 'light')
  } catch {}
  syncThemeChrome()
}

themeToggle?.addEventListener('click', () => {
  applyTheme(!isDarkTheme())
})

window.matchMedia('(prefers-color-scheme: dark)')?.addEventListener('change', (event) => {
  let stored = null
  try {
    stored = localStorage.getItem('strm-theme')
  } catch {}
  if (!stored) applyTheme(event.matches)
})

syncThemeChrome()

const menuButton = document.querySelector('.menu-button')
const navigation = document.querySelector('.site-nav')

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open')
    menuButton.setAttribute('aria-expanded', String(isOpen))
  })

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navigation.classList.remove('is-open')
      menuButton.setAttribute('aria-expanded', 'false')
    })
  })
}

const featureDetails = [
  {
    id: 'scan',
    index: '01',
    title: '扫描整理',
    description: 'StrmTool 先建立文件清单，再识别标题、命名与目标路径；批量执行前可完整预览所有变更。',
    points: [
      '扫描视频与字幕文件，并排除无需参与整理的目录。',
      '解析标题、年份、分辨率、编码、音轨、HDR 与剧集信息。',
      '在执行前集中确认新的文件名、归档目录与冲突结果。',
    ],
    traceLabel: '扫描流程',
    traceValue: '来源目录 → 文件解析 → TMDB 匹配 → 结果预览',
  },
  {
    id: 'watch',
    index: '02',
    title: '监控任务',
    description: '为下载目录与媒体库建立长期映射；新增文件出现后，按已配置的模板、整理方式与分类规则完成归档。',
    points: [
      '分别指定来源目录、目标目录、媒体类型、命名模板、冲突策略与刮削。',
      '自动监控新增内容，减少重复扫描与手动操作。',
      '可按目录分类，将电影、剧集与特殊内容归档至不同位置。',
    ],
    traceLabel: '监控流程',
    traceValue: '文件事件 → 元数据识别 → 规则分类 → 自动整理',
  },
  {
    id: 'history',
    index: '03',
    title: '历史修正',
    description: '整理过程可追溯、可修正；StrmTool 保留每次操作记录，支持修正识别结果并重新归档。',
    points: [
      '按影片与剧集聚合操作记录，避免无序文件列表。',
      '对未识别或错误识别的文件补充标题、年份和媒体类型。',
      '修正后可批量重新整理，降低单文件重复处理成本。',
    ],
    traceLabel: '修正流程',
    traceValue: '历史记录 → 检查结果 → 手动修正 → 重新整理',
  },
  {
    id: 'rules',
    index: '04',
    title: '规则配置',
    description: '统一管理命名模板、识别词与分类条件，使媒体库结构由可复用规则驱动。',
    points: [
      '通过可视化模板构建电影、季、集和文件名的目标结构。',
      '维护识别词与优先级，降低标题噪声对识别结果的影响。',
      '将演员、类型、国家、语言与关键词组合为分类规则。',
    ],
    traceLabel: '规则引擎',
    traceValue: '识别字段 → 命名模板 → 分类条件 → 目标目录',
  },
  {
    id: 'scrape',
    index: '05',
    title: 'Emby 刮削',
    description: '整理完成后，按 Emby 目录规范写入 NFO 与海报。扫描和监控任务都可单独开关；也可以只下载图片，把剧情交给 Emby。',
    points: [
      '写入电影、剧集与分集 NFO，包含标题、简介、演职员以及 TMDB / IMDb 编号。',
      '下载 poster、fanart、logo，以及剧集的季海报与分集缩略图。',
      '已有文件不覆盖；演员只写入带头像的条目。刮削语言可选中文优先或原语言优先。',
    ],
    traceLabel: '刮削流程',
    traceValue: 'TMDB 匹配 → 写入 NFO / 海报 → Emby 识别入库',
  },
]

const featureDialog = document.querySelector('#feature-dialog')
const featureButtons = [...document.querySelectorAll('[data-feature]')]
const dialogClose = document.querySelector('.dialog-close')
const dialogSteps = [...document.querySelectorAll('[data-feature-step]')]
const dialogIndex = document.querySelector('#feature-dialog-index')
const dialogTitle = document.querySelector('#feature-dialog-title')
const dialogMark = document.querySelector('#feature-dialog-mark')
const dialogDescription = document.querySelector('#feature-dialog-description')
const dialogList = document.querySelector('.feature-detail-list')
const dialogTraceLabel = document.querySelector('#feature-trace-label')
const dialogTraceValue = document.querySelector('#feature-trace-value')
const dialogCount = document.querySelector('#feature-dialog-count')
let activeFeatureIndex = 0

function renderFeature(index) {
  activeFeatureIndex = (index + featureDetails.length) % featureDetails.length
  const feature = featureDetails[activeFeatureIndex]

  if (dialogIndex) dialogIndex.textContent = `模块 / ${feature.index}`
  if (dialogTitle) dialogTitle.textContent = feature.title
  if (dialogMark) dialogMark.textContent = feature.index
  if (dialogDescription) dialogDescription.textContent = feature.description
  if (dialogTraceLabel) dialogTraceLabel.textContent = feature.traceLabel
  if (dialogTraceValue) dialogTraceValue.textContent = feature.traceValue
  if (dialogCount) dialogCount.textContent = `${feature.index} / ${String(featureDetails.length).padStart(2, '0')}`

  if (dialogList) {
    dialogList.replaceChildren(...feature.points.map((point) => {
      const item = document.createElement('li')
      item.textContent = point
      return item
    }))
  }

}

function closeFeatureDialog() {
  if (!featureDialog) return
  if (typeof featureDialog.close === 'function') featureDialog.close()
  else featureDialog.removeAttribute('open')
}

featureButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const index = featureDetails.findIndex((feature) => feature.id === button.dataset.feature)
    renderFeature(index < 0 ? 0 : index)

    if (!featureDialog) return
    if (typeof featureDialog.showModal === 'function') featureDialog.showModal()
    else featureDialog.setAttribute('open', '')
  })
})

dialogClose?.addEventListener('click', closeFeatureDialog)

featureDialog?.addEventListener('click', (event) => {
  if (event.target === featureDialog) closeFeatureDialog()
})

dialogSteps.forEach((button) => {
  button.addEventListener('click', () => {
    const direction = button.dataset.featureStep === 'next' ? 1 : -1
    renderFeature(activeFeatureIndex + direction)
  })
})

const modeDetails = {
  hardlink: {
    index: '方式 / 01',
    title: '硬链接',
    description: '源目录与媒体库共享同一份磁盘数据，整理后不会额外占用空间。',
    path: '/media/Movies/Dune Part Two (2024).mkv',
    benefit: '共享同一 inode；跨文件系统时可自动回退为复制。',
  },
  symlink: {
    index: '方式 / 02',
    title: '软链接',
    description: '媒体库保存一个指向原文件的链接，原始下载目录仍是内容的真实位置。',
    path: '/media/Movies/Dune Part Two (2024).mkv -> /downloads/Dune.Part.Two.2024.mkv',
    benefit: '可跨目录组织，适合希望保留原始下载结构的场景。',
  },
  copy: {
    index: '方式 / 03',
    title: '复制',
    description: '将完整文件复制到媒体库，来源和归档目录拥有各自独立的数据副本。',
    path: '/media/Movies/Dune Part Two (2024).mkv',
    benefit: '适合跨文件系统或需要独立备份媒体库的场景。',
  },
  move: {
    index: '方式 / 04',
    title: '移动',
    description: '确认目标路径后将媒体迁移到归档目录，让下载目录保持简洁。',
    path: '/media/Movies/Dune Part Two (2024).mkv',
    benefit: '整理完成后不保留来源副本，适合最终归档流程。',
  },
}

const modeTabs = [...document.querySelectorAll('[data-mode]')]
const modeIndex = document.querySelector('#mode-index')
const modeTitle = document.querySelector('#mode-title')
const modeDescription = document.querySelector('#mode-description')
const modeLibraryPath = document.querySelector('#mode-library-path')
const modeBenefit = document.querySelector('#mode-benefit')

function renderMode(mode) {
  const detail = modeDetails[mode]
  if (!detail) return

  if (modeIndex) modeIndex.textContent = detail.index
  if (modeTitle) modeTitle.textContent = detail.title
  if (modeDescription) modeDescription.textContent = detail.description
  if (modeLibraryPath) modeLibraryPath.textContent = detail.path
  if (modeBenefit) modeBenefit.textContent = detail.benefit

  modeTabs.forEach((tab) => {
    const isSelected = tab.dataset.mode === mode
    tab.classList.toggle('is-active', isSelected)
    tab.setAttribute('aria-selected', String(isSelected))
    tab.tabIndex = isSelected ? 0 : -1
  })
}

modeTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => renderMode(tab.dataset.mode))

  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()

    let nextIndex = index
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + modeTabs.length) % modeTabs.length
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % modeTabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = modeTabs.length - 1

    const nextTab = modeTabs[nextIndex]
    renderMode(nextTab.dataset.mode)
    nextTab.focus()
  })
})

const scrapeDetails = {
  movie: {
    index: '输出 / 01',
    title: '电影 NFO 与海报',
    description: '独立电影目录写入同名 NFO，以及 poster、fanart、logo；已存在的文件会跳过。',
    paths: [
      ['NFO', 'Dune Part Two (2024).nfo'],
      ['海报', 'poster.jpg · fanart.jpg · logo.png'],
    ],
    benefit: '标题、简介和海报语言可选中文优先或原语言优先。',
  },
  tv: {
    index: '输出 / 02',
    title: '剧集 NFO 与海报',
    description: '剧集目录写入 tvshow.nfo、分集 NFO、季海报和分集缩略图，同一部剧只写一次节目级文件。',
    paths: [
      ['节目', 'tvshow.nfo · poster.jpg · fanart.jpg · logo.png'],
      ['季 / 集', 'season01-poster.jpg · S01E01-thumb.jpg · S01E01.nfo'],
    ],
    benefit: '演员最多写入 10 位，且只保留带头像的条目。',
  },
  art: {
    index: '输出 / 03',
    title: '仅海报',
    description: '关闭写入 NFO 后只下载图片，剧情和演职员交给 Emby 自己补全。',
    paths: [
      ['海报', 'poster.jpg · fanart.jpg · logo.png'],
      ['剧集', 'season01-poster.jpg · S01E01-thumb.jpg'],
    ],
    benefit: '适合已经由 Emby 管理元数据、只想补齐封面的媒体库。',
  },
}

const scrapeTabs = [...document.querySelectorAll('[data-scrape]')]
const scrapeIndex = document.querySelector('#scrape-index')
const scrapeTitle = document.querySelector('#scrape-title')
const scrapeDescription = document.querySelector('#scrape-description')
const scrapePaths = document.querySelector('#scrape-paths')
const scrapeBenefit = document.querySelector('#scrape-benefit')

function renderScrape(mode) {
  const detail = scrapeDetails[mode]
  if (!detail) return

  if (scrapeIndex) scrapeIndex.textContent = detail.index
  if (scrapeTitle) scrapeTitle.textContent = detail.title
  if (scrapeDescription) scrapeDescription.textContent = detail.description
  if (scrapeBenefit) scrapeBenefit.textContent = detail.benefit
  if (scrapePaths) {
    scrapePaths.replaceChildren(...detail.paths.map(([label, value]) => {
      const row = document.createElement('div')
      const name = document.createElement('span')
      const code = document.createElement('code')
      name.textContent = label
      code.textContent = value
      row.append(name, code)
      return row
    }))
  }

  scrapeTabs.forEach((tab) => {
    const isSelected = tab.dataset.scrape === mode
    tab.classList.toggle('is-active', isSelected)
    tab.setAttribute('aria-selected', String(isSelected))
    tab.tabIndex = isSelected ? 0 : -1
  })
}

scrapeTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => renderScrape(tab.dataset.scrape))

  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()

    let nextIndex = index
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + scrapeTabs.length) % scrapeTabs.length
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % scrapeTabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = scrapeTabs.length - 1

    const nextTab = scrapeTabs[nextIndex]
    renderScrape(nextTab.dataset.scrape)
    nextTab.focus()
  })
})

renderFeature(0)
renderMode('hardlink')
renderScrape('movie')

const deployDetails = {
  docker: {
    tabId: 'deploy-tab-docker',
    filename: 'docker run',
    hint: '在已安装 Docker 的机器上直接执行。将 /your/media 换成你的媒体根目录。',
    code: `docker run -d \\
  --name strmtool \\
  --restart unless-stopped \\
  -p 8080:8080 \\
  -e TZ=Asia/Shanghai \\
  -v /your/media:/media \\
  -v ./data:/data \\
  sisheng36/strmtool:latest`,
  },
  compose: {
    tabId: 'deploy-tab-compose',
    filename: 'docker-compose.yml',
    hint: '保存为 docker-compose.yml 后，在同目录执行 docker compose up -d。将 /your/media 换成你的媒体根目录。',
    code: `services:
  strmtool:
    image: sisheng36/strmtool:latest
    container_name: strmtool
    ports:
      - "8080:8080"
    volumes:
      # 源和目标需在同一挂载点下才能硬链接
      - /your/media:/media
      - ./data:/data
    environment:
      - TZ=Asia/Shanghai
    restart: unless-stopped`,
  },
}

const deployTabs = [...document.querySelectorAll('[data-deploy]')]
const deployPanel = document.querySelector('#deploy-panel')
const deployFilename = document.querySelector('#deploy-filename')
const deployHint = document.querySelector('#deploy-hint')
const deployCode = document.querySelector('#deploy-code')
const deployCopy = document.querySelector('#deploy-copy')
let activeDeploy = 'docker'
let copyResetTimer = 0

function renderDeploy(mode) {
  const detail = deployDetails[mode]
  if (!detail) return

  activeDeploy = mode
  if (deployFilename) deployFilename.textContent = detail.filename
  if (deployHint) deployHint.textContent = detail.hint
  if (deployCode) deployCode.textContent = detail.code
  if (deployPanel) deployPanel.setAttribute('aria-labelledby', detail.tabId)
  if (deployCopy) {
    deployCopy.textContent = '复制'
    deployCopy.classList.remove('is-copied')
  }

  deployTabs.forEach((tab) => {
    const isSelected = tab.dataset.deploy === mode
    tab.classList.toggle('is-active', isSelected)
    tab.setAttribute('aria-selected', String(isSelected))
    tab.tabIndex = isSelected ? 0 : -1
  })
}

deployTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => renderDeploy(tab.dataset.deploy))

  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()

    let nextIndex = index
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + deployTabs.length) % deployTabs.length
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % deployTabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = deployTabs.length - 1

    const nextTab = deployTabs[nextIndex]
    renderDeploy(nextTab.dataset.deploy)
    nextTab.focus()
  })
})

async function copyDeployCode() {
  const detail = deployDetails[activeDeploy]
  if (!detail || !deployCopy) return

  try {
    await navigator.clipboard.writeText(detail.code)
  } catch {
    const selection = window.getSelection()
    const range = document.createRange()
    if (!deployCode || !selection) return
    range.selectNodeContents(deployCode)
    selection.removeAllRanges()
    selection.addRange(range)
    document.execCommand('copy')
    selection.removeAllRanges()
  }

  deployCopy.textContent = '已复制'
  deployCopy.classList.add('is-copied')
  window.clearTimeout(copyResetTimer)
  copyResetTimer = window.setTimeout(() => {
    deployCopy.textContent = '复制'
    deployCopy.classList.remove('is-copied')
  }, 1800)
}

deployCopy?.addEventListener('click', () => {
  copyDeployCode()
})

renderDeploy('docker')
