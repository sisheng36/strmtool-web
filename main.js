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
    description: '从一个目录开始，StrmTool 会先建立清单，再让你确认识别、命名和目标位置。批量执行之前，所有变化都能预览。',
    points: [
      '扫描视频与字幕文件，并忽略不需要参与整理的隐藏目录。',
      '解析标题、年份、分辨率、编码、音轨、HDR 与剧集信息。',
      '在执行前集中查看新的文件名、归档目录与冲突结果。',
    ],
    traceLabel: '扫描流程',
    traceValue: '来源目录 → 文件解析 → TMDB 匹配 → 结果预览',
  },
  {
    id: 'watch',
    index: '02',
    title: '监控任务',
    description: '为下载目录和媒体库建立长期映射。新文件出现后，它会遵循已选模板、整理方式和分类规则完成入库。',
    points: [
      '分别指定来源、目标目录、媒体类型、命名模板与冲突策略。',
      '自动监控让日常补档不再需要重复扫描和手工拖拽。',
      '可以按目录分类，让电影、剧集与特殊内容进入不同位置。',
    ],
    traceLabel: '监控流程',
    traceValue: '文件事件 → 元数据识别 → 规则分类 → 自动整理',
  },
  {
    id: 'history',
    index: '03',
    title: '历史修正',
    description: '整理并不是不可逆的黑盒。StrmTool 为操作保留记录，让你能回到某次处理，修正识别，再重新归档。',
    points: [
      '按影片与剧集聚合操作记录，避免面对无序的文件列表。',
      '对未识别或错误识别的文件补充标题、年份和媒体类型。',
      '修正后可批量重新整理，减少单个文件反复处理的成本。',
    ],
    traceLabel: '修正流程',
    traceValue: '历史记录 → 检查结果 → 手动修正 → 重新整理',
  },
  {
    id: 'rules',
    index: '04',
    title: '规则配置',
    description: '命名模板、识别词与分类条件集中在一处管理。你的媒体库结构不再依赖临时记忆，而是可复用的规则。',
    points: [
      '通过可视化模板构建电影、季、集和文件名的目标结构。',
      '维护识别词与优先级，减少标题中的噪声对识别结果的影响。',
      '将演员、类型、国家、语言与关键词组合成分类规则。',
    ],
    traceLabel: '规则引擎',
    traceValue: '识别字段 → 命名模板 → 分类条件 → 目标目录',
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
  if (dialogCount) dialogCount.textContent = `${feature.index} / 04`

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

renderFeature(0)
renderMode('hardlink')
